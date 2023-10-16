import { Args, Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { OfflinePlayerDTO } from "common";
import { OfflinePlayerService } from "../../offlinePlayer.service";
import { matchFilters } from "common/dist/util/matchFilters";

const subscriptionName = "offlinePlayer";

@Resolver("Subscription")
export class OfflinePlayerResolver {
  constructor(
    @Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub,
    @Inject(OfflinePlayerService)
    private readonly service: OfflinePlayerService,
  ) {}

  @Subscription(subscriptionName, {
    filter: (
      payload: { offlinePlayer: OfflinePlayerDTO },
      variables: { filter: Partial<OfflinePlayerDTO> },
    ) =>
      matchFilters(
        Object.keys(variables.filter || {}),
        payload.offlinePlayer,
        variables.filter,
      ),
    resolve: (payload) => payload.offlinePlayer,
  })
  async offlinePlayer(@Args("filter") filter: Partial<OfflinePlayerDTO>) {
    switch (true) {
      case filter.playerId != undefined: {
        console.log("### Querying player service...");
        this.service.getOfflinePlayer(filter.playerId).then(async (payload) => {
          console.log("### Querying player service... done!");
          await this.pubSub.publish(subscriptionName, payload);
        });
      }
      default:
        return this.pubSub.asyncIterator(subscriptionName);
    }
  }
}
