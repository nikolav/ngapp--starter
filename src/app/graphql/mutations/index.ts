import { gql } from "apollo-angular";

// cacheRedisCommit(cache_key: String!, patch: JsonData, merge: Boolean): JsonData!
export const M_cacheRedisCommit = gql`
  mutation m_cacheRedisCommit(
    $cache_key: String!
    $patch: JsonData
    $merge: Boolean
  ) {
    cacheRedisCommit(cache_key: $cache_key, patch: $patch, merge: $merge)
  }
`;

