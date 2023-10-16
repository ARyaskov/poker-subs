import { Module } from "@nestjs/common";
import { PlayerModule } from "./player/player.module";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { resolve } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      typePaths: [resolve(__dirname, "../graphql/**/*.graphql")],
      path: "/api/v0/graphql",
      subscription: {
        fullWsTransport: true,
      },
    }),
    PlayerModule,
  ],
})
export class AppModule {}
