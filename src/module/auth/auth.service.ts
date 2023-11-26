import { Injectable } from "@nestjs/common";
import { UserService } from "src/module/user/user.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(username);
    return user;
  }
}
