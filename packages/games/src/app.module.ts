import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { resolve } from "path";
import { GamesModule } from "./games/games.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_URI: Joi.string(),
        HOST: Joi.string(),
        PORT: Joi.number(),
      }),
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      typePaths: [resolve(__dirname, "../graphql/**/*.graphql")],
      path: "/api/v0/graphql",
      subscription: {
        fullWsTransport: true,
      },
    }),
    GamesModule,
  ],
})
export class AppModule {}
