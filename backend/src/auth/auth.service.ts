import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { player, refreshtoken } from '@prisma/client';
import * as argon2 from 'argon2';
import { PlayerService } from 'src/player/player.service';
import { SignUpDto } from './dto/signUp.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private playerService: PlayerService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async signIn(username: string, pass: string): Promise<any> {
    const player: player = await this.playerService.findOne({
      username: username,
    });
    if (!player) {
      throw new UnauthorizedException();
    }
    if (
      await !argon2.verify(
        player.password.toString(),
        player.salt.toString() + pass,
      )
    ) {
      throw new UnauthorizedException();
    }
    const payload = { username: player.username, sub: player.id };
    return this.generateTokenPair(payload);
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const player: player = await this.playerService.registerPlayer(signUpDto);
    const payload = { username: player.username, sub: player.id };
    return this.generateTokenPair(payload);
  }

  async logout(req: Request): Promise<void> {
    const refreshToken: string = this.extractTokenFromHeader(req);
    if (!refreshToken) {
      return;
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      return;
    }
    await this.prisma.refreshtoken.update({ where: { player_id_token_str: { player_id: payload.sub, token_str: refreshToken } }, data: { is_used: true } });
    return;
  }

  async refresh(req: Request): Promise<any> {
    const refreshToken: string = this.extractTokenFromHeader(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    let payload: { username: string, sub: number, };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException();
    }
    let tokenEntry: refreshtoken = await this.prisma.refreshtoken.findUnique({ where: { player_id_token_str: { player_id: payload.sub, token_str: refreshToken } } });
    if (tokenEntry?.is_used) {
      throw new UnauthorizedException();
    }
    await this.prisma.refreshtoken.update({ where: { player_id_token_str: { player_id: payload.sub, token_str: refreshToken } }, data: { is_used: true } });
    payload = { username: payload.username, sub: payload.sub };
    return this.generateTokenPair(payload);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async generateTokenPair(payload: {
    username: string,
    sub: number,
  }): Promise<{ access_token: string; refresh_token: string }> {
    let refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    await this.prisma.refreshtoken.create({ data: { player_id: payload.sub, token_str: refresh_token } });
    let access_token = await this.jwtService.signAsync(payload);
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}
