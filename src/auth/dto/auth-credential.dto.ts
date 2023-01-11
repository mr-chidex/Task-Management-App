import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
