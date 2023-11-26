import { APP_GUARD } from "@nestjs/core";

export const AuthGuard = {
  provide: APP_GUARD,
  //   useClass: AuthGuardService,
};
