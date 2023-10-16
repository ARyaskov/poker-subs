import "reflect-metadata";
import "core-js/stable";
import "core-js/stage";
import "regenerator-runtime/runtime";

import React from "react";
import Application from "./Application";
import { createRoot } from "react-dom/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
const domNode = document.getElementById("container");
const root = createRoot(domNode);

const MONITORING_ENDPOINT = `ws://${process.env.REACT_APP_MONITORING_ENDPOINT}/api/v0/graphql`;
const STATS_ENDPOINT = `ws://${process.env.REACT_APP_STATS_ENDPOINT}/api/v0/graphql`;

const monitoringLink = new WebSocketLink({
  uri: MONITORING_ENDPOINT,
  options: {
    reconnect: true,
  },
});

const statsLink = new WebSocketLink({
  uri: STATS_ENDPOINT,
  options: {
    reconnect: true,
  },
});

const monitoringOperationNames = [
  "offlinePlayer",
  "inGamePlayer",
  "freeTable",
  "occupiedTable",
];

const link = split(
  ({ query, operationName }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription" &&
      monitoringOperationNames.includes(operationName)
    );
  },
  monitoringLink,
  statsLink,
);

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

root.render(
  <ApolloProvider client={apolloClient}>
    <Application />
  </ApolloProvider>,
);
