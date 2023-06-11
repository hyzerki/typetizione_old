import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PlayerModule } from 'src/player/player.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    PlayerModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15s' },
    }),
  ],
  providers: [AuthService, AuthGuard, PrismaService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
