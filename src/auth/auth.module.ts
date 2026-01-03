import { Module, forwardRef } from '@nestjs/common';
import { BcryptHashingService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule],
})
export class AuthModule {}
