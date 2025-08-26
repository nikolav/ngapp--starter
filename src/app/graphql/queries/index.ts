import { gql } from "apollo-angular";

// status: JsonData
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

// collectionsDocsByTopic(topic: String!, config: JsonData): JsonData!
export const Q_collectionsDocsByTopic = gql`
  query q_collectionsDocsByTopic($topic: String!, $config: JsonData) {
    collectionsDocsByTopic(topic: $topic, config: $config)
  }
`;
