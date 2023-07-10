import { IsJWT, IsString, IsStrongPassword } from "class-validator";

export class AuthResetDTO {
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 0,
    minLowercase: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsJWT()
  @IsString()
  token: string;
}
