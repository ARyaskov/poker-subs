import { Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { OccupiedTableService } from "../../occupiedTable.service";

const subscriptionName = "occupiedTable";

@Resolver("Subscription")
export class OccupiedTableResolver {
  constructor(
    @Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub,
    @Inject(OccupiedTableService)
    private readonly service: OccupiedTableService,
  ) {}

  @Subscription(subscriptionName, {
    resolve: (payload) => payload.occupiedTable,
  })
  async occupiedTable() {
    console.log("### Querying games service...");
    this.service.getOccupiedTables().then(async (payload) => {
      console.log("### Querying games service... done!");
      await this.pubSub.publish(subscriptionName, payload);
    });
    return this.pubSub.asyncIterator(subscriptionName);
  }
}
