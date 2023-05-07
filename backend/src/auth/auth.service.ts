import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { player } from '@prisma/client';
import * as argon2 from 'argon2';
import { PlayerService } from 'src/player/player.service';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private playerService: PlayerService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const player: player = await this.playerService.findOne({
      username: username,
    });
    if (
      await !argon2.verify(
        player.password.toString(),
        player.salt.toString() + pass,
      )
    ) {
      throw new UnauthorizedException();
    }
    const payload = { username: player.username, sub: player.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const player: player = await this.playerService.registerPlayer(signUpDto);
    const payload = { username: player.username, sub: player.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
