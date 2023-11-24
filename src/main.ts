import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

const logger = new Logger("SpaceRental");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get("PORT", "4000"), 10);

  app.enableCors({
    origin: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Space Rental API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.css",
    ],
  });

  await app.listen(port);

  return `${await app.getUrl()}`;
}

bootstrap()
  .then((serverUrl) => logger.log(`Server is running at: ${serverUrl}`))
  .catch((err) => logger.error("Something went wrong!", err));
