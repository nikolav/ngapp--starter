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

// collectionsByTopic(topic: String!, config: JsonData!): JsonData!
export const Q_collectionsByTopic = gql`
  query q_collectionsByTopic($topic: String!, $config: JsonData!) {
    collectionsByTopic(topic: $topic, config: $config)
  }
`;
