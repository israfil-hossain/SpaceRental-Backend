import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const documentConfig = new DocumentBuilder()
  .setTitle("Space Rental API")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

export const configureSwaggerUI = (app: INestApplication<any>) => {
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup("swagger", app, document, {
    customSiteTitle: "Space Rental API",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.css",
    ],
  });
};
