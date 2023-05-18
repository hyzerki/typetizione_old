import { IsByteLength, IsNotEmpty, IsString, isByteLength } from 'class-validator';
export class SignInDto {
  @IsString()
  @IsNotEmpty({message: "Username cannot be empty. "})
  @IsByteLength(5,undefined,{message:"Password length must be more than 5 characters. "})
  username: string;
  
  @IsString()
  @IsNotEmpty({message: "Password cannot be empty. "})
  @IsByteLength(6,undefined,{message:"Password length must be more than 6 characters. "})
  password: string;
}
  