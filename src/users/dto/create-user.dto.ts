import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minNumbers: 0,
    minLowercase: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsString()
  @IsOptional()
  birthAt: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
