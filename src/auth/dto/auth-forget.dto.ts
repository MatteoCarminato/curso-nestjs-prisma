import { IsString } from "class-validator";

export class AuthForgetDTO {
  @IsString()
  email: string;
}
