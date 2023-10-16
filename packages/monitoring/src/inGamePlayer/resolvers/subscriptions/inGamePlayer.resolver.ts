import { Args, Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { InGamePlayerDTO } from "common";
import { InGamePlayerService } from "../../inGamePlayer.service";
import { matchFilters } from "common";

const subscriptionName = "inGamePlayer";

@Resolver("Subscription")
export class InGamePlayerResolver {
  constructor(
    @Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub,
    @Inject(InGamePlayerService) private readonly service: InGamePlayerService,
  ) {}

  @Subscription(subscriptionName, {
    filter: (
      payload: { inGamePlayer: InGamePlayerDTO },
      variables: { filter: Partial<InGamePlayerDTO> },
    ) =>
      matchFilters(
        Object.keys(variables.filter || {}),
        payload.inGamePlayer,
        variables.filter,
      ),
    resolve: (payload) => payload.inGamePlayer,
  })
  async inGamePlayer(@Args("filter") filter: Partial<InGamePlayerDTO>) {
    switch (true) {
      case filter.playerId != undefined: {
        console.log("### Querying player & game services...");
        this.service.getInGamePlayer(filter.playerId).then(async (payload) => {
          console.log("### Querying player & game services... done!");
          await this.pubSub.publish(subscriptionName, payload);
        });
      }
      default:
        return this.pubSub.asyncIterator(subscriptionName);
    }
  }
}
