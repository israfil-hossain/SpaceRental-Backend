import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly _logger: Logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendUserSigninMail(userEmail: string, userName: string) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: "New signin detected",
        template: "./signin",
        context: {
          name: userName,
        },
      });
      this._logger.log("Email sent successfully to: " + userEmail);
    } catch (error) {
      this._logger.error("Failed to send email: " + error);
    }
  }

  async sendUserSignupMail(userEmail: string, userName: string) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: "Welcome abroad",
        template: "./signup",
        context: {
          companyName: "Space Rental",
          userName,
        },
      });
      this._logger.log("Email sent successfully to: " + userEmail);
    } catch (error) {
      this._logger.error("Failed to send email: " + error);
    }
  }
}
