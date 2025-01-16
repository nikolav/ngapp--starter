import { gql } from "apollo-angular";

export const Q_status = gql`
  query q_status {
    status
  }
`;

// cacheRedisGetCacheByKey(cache_key: String!): JsonData!
export const Q_cacheRedisGetCacheByKey = gql`
  query q_cacheRedisGetCacheByKey($cache_key: String!) {
    cacheRedisGetCacheByKey(cache_key: $cache_key)
  }
`;
