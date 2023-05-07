import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PlayerModule } from 'src/player/player.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PlayerModule,
    PassportModule,
    JwtModule.register({
      global: true,

      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
