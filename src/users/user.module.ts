import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from "@nestjs/common";
import { UserController } from './user.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserIdCheckMiddleware } from 'src/middlewares/user-id-check.middleware';
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: "user/:id",
      method: RequestMethod.ALL,
    });
  }
}
