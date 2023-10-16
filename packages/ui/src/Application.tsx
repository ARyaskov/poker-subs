import React, { useState } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";
import _ from "lodash";

function removeTypename(obj) {
  if (_.isArray(obj)) {
    return obj.map((item) => removeTypename(item));
  } else if (_.isObject(obj)) {
    return _.omitBy(obj, (value, key) => {
      if (key === "__typename") {
        return true;
      } else if (_.isObject(value)) {
        return removeTypename(value);
      }
      return false;
    });
  } else {
    return obj;
  }
}

const GET_GAME_STATISTICS = gql`
  query getGameStatistics {
    getGameStatistics {
      averageStackAtCents
      totalActiveTables
      averagePlayersPerTable
      totalOnlinePlayers
      averageBalanceOfOfflinePlayers
      mostPopularGameType
    }
  }
`;

function Application() {
  let { data: queryData } = useQuery(GET_GAME_STATISTICS);
  const [offlinePlayerData, setOfflinePlayerData] = useState(null);
  const [inGamePlayerData, setInGamePlayerData] = useState(null);
  const [freeTableData, setFreeTableData] = useState(null);
  const [occupiedTableData, setOccupiedTableData] = useState(null);

  const OFFLINE_PLAYER = gql`
    subscription offlinePlayer {
      offlinePlayer(
        filter: {
          playerId: "c918c6b5-9ea0-4e01-8e2f-56d1488a9e66"
          name: "Grace"
        }
      ) {
        playerId
        name
        balanceAtCents
      }
    }
  `;
  const IN_GAME_PLAYER = gql`
    subscription inGamePlayer {
      inGamePlayer(
        filter: {
          playerId: "76a1ac99-0b61-49d5-8a53-1c6ff5c194cc"
          name: "David"
        }
      ) {
        playerId
        name
        totalOnlineTables
        organizations {
          id
          inGameTables
        }
      }
    }
  `;

  const FREE_TABLE = gql`
    subscription freeTable {
      freeTable {
        gameType
        bbInCents
        anteInCents
        organizationId
        size
      }
    }
  `;

  const OCCUPIED_TABLE = gql`
    subscription occupiedTable {
      occupiedTable {
        gameType
        bbAtCents
        anteAtCents
        organizationId
        size
        occupiedSeatsCount
      }
    }
  `;

  useSubscription(OFFLINE_PLAYER, {
    onData: ({ data }) =>
      data.data ? setOfflinePlayerData(data.data.offlinePlayer) : {},
  });
  useSubscription(IN_GAME_PLAYER, {
    onData: ({ data }) =>
      data.data ? setInGamePlayerData(data.data.inGamePlayer) : {},
  });
  useSubscription(FREE_TABLE, {
    onData: ({ data }) =>
      data.data ? setFreeTableData(data.data.freeTable) : {},
  });
  useSubscription(OCCUPIED_TABLE, {
    onData: ({ data }) =>
      data.data ? setOccupiedTableData(data.data.occupiedTable) : {},
  });

  return (
    <div>
      <h1>POKER UI</h1>
      <h2>Game Statistics:</h2>
      <pre>
        {JSON.stringify(removeTypename(queryData?.getGameStatistics), null, 2)}
      </pre>

      <h2>Offline Player Data:</h2>
      <pre>{JSON.stringify(removeTypename(offlinePlayerData), null, 2)}</pre>

      <h2>In Game Player Data:</h2>
      <pre>{JSON.stringify(removeTypename(inGamePlayerData), null, 2)}</pre>

      <h2>Free Table Data:</h2>
      <pre>{JSON.stringify(removeTypename(freeTableData), null, 2)}</pre>

      <h2>Occupied Table Data:</h2>
      <pre>{JSON.stringify(removeTypename(occupiedTableData), null, 2)}</pre>
    </div>
  );
}

export default Application;
