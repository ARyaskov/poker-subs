import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { resolve } from "path";
import { OfflinePlayerModule } from "./offlinePlayer/offlinePlayer.module";
import { InGamePlayerModule } from "./inGamePlayer/inGamePlayer.module";
import { FreeTableModule } from "./freeTable/freeTable.module";
import { OccupiedTableModule } from "./occupiedTable/occupiedTable.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_URI: Joi.string(),
        PLAYERS_ENDPOINT: Joi.string(),
        GAMES_ENDPOINT: Joi.string(),
        STATS_ENDPOINT: Joi.string(),
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
    OfflinePlayerModule,
    InGamePlayerModule,
    FreeTableModule,
    OccupiedTableModule,
  ],
})
export class AppModule {}
