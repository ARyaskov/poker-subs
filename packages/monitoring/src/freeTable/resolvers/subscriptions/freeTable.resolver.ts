import { Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { FreeTableService } from "../../freeTable.service";

const subscriptionName = "freeTable";

@Resolver("Subscription")
export class FreeTableResolver {
  constructor(
    @Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub,
    @Inject(FreeTableService) private readonly service: FreeTableService,
  ) {}

  @Subscription(subscriptionName, {
    resolve: (payload) => payload.freeTable,
  })
  async freeTable() {
    console.log("### Querying games service...");
    this.service.getFreeTables().then(async (payload) => {
      console.log("### Querying games service... done!");
      await this.pubSub.publish(subscriptionName, payload);
    });
    return this.pubSub.asyncIterator(subscriptionName);
  }
}
