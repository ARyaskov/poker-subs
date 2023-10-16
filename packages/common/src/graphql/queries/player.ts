import "../fragments/playerInfo.fragment.gql";
import { gql } from "graphql-request";

gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...PlayerInfo
    }
  }
`;
