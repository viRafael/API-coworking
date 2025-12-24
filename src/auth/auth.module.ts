import { Global, Module } from '@nestjs/common';
import { BcryptHashingService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [HashingService, JwtModule, ConfigModule],
})
export class AuthModule {}
