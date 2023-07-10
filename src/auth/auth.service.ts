import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/users/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: users) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        expiresIn: "7 days",
        issuer: "login",
        audience: "user",
      },
    );
    return { accessToken: token };
  }

  checkToken($token) {
    console.log($token);
    try {
      const data = this.jwtService.verify($token, {
        issuer: "login",
        audience: "user",
      });
      return data;
    } catch (e) {
      console.log(e)
      throw new BadRequestException(e);
    }
  }

  isValidToken($token) {
    try {
      this.checkToken($token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login({ email, password }) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Email e/ou senha inválidos");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Email e/ou senha inválidos");
    }

    return this.createToken(user);
  }

  async forget({ email }) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Email inválidos");
    }

    return true;
  }

  async reset(user) {
    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
