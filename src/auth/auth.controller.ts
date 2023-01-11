import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { AuthPipe } from './pipes/auth.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(AuthPipe)
  register(@Body(ValidationPipe) authCredential: RegisterAuthDto) {
    return this.authService.signup(authCredential);
  }

  @Post('signin')
  @UsePipes(AuthPipe)
  login(@Body(ValidationPipe) authCredential: LoginAuthDto) {
    return this.authService.signin(authCredential);
  }
}
