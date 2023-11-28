import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ValidationError } from "class-validator";

interface FormattedErrors {
  [key: string]: string[];
}

export const ValidationProvider = {
  provide: APP_PIPE,
  useFactory: () =>
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors: FormattedErrors = {};
        errors.forEach((error) => {
          const propertyName = error.property;
          Object.entries(error.constraints || {}).forEach((constraint) => {
            if (!formattedErrors[propertyName]) {
              formattedErrors[propertyName] = [];
            }
            formattedErrors[propertyName].push(constraint[1]);
          });
        });
        return new BadRequestException({
          message: "Validation failed",
          error: formattedErrors,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      },
    }),
};
