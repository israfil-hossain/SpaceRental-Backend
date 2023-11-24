import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [UserModule, MongooseModule.forRoot("mongodb://localhost:27017")],
  controllers: [],
  providers: [],
})
export class AppModule {}
