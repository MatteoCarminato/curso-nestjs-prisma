import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guards";
import { User } from "src/decorators/user.decorator";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post("login")
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login({ email, password });
  }

  @Post("register")
  async register(@Body() data: AuthRegisterDTO) {
    return this.authService.register(data);
  }

  @Post("forget")
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget({ email });
  }

  @Post("reset")
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset({ password, token });
  }

  @UseGuards(AuthGuard)
  @Post("me")
  async me(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  @Post("photo")
  async photo(@User() user, @UploadedFile() file: Express.Multer.File) {
    const path = join(
      __dirname,
      "..",
      "..",
      "storage",
      "photos",
      `photos-${user.id}.png`,
    );

    try {
      this.fileService.upload(file, path);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return { success: true };
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: "photo1",
        maxCount: 2,
      },
      {
        name: "photo2",
        maxCount: 4,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post("files-fields")
  async filesFields(
    @User() user,
    @UploadedFiles()
    files: { photo1: Express.Multer.File; photo2: Express.Multer.File },
  ) {
    return { success: true };
  }
}
