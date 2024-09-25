import { IsNotEmpty } from 'class-validator';

export class AuthLogInDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
