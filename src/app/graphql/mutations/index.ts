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

// collectionsDocsUpsert(topic: String!, patches: [JsonData!]!): JsonData!
export const M_collectionsDocsUpsert = gql`
  mutation m_collectionsDocsUpsert($topic: String!, $patches: [JsonData!]!) {
    collectionsDocsUpsert(topic: $topic, patches: $patches)
  }
`;

// collectionsDocsDrop(topic: String!, ids: [ID!]!): JsonData!
export const M_collectionsDocsDrop = gql`
  mutation m_collectionsDocsDrop($topic: String!, $ids: [ID!]!) {
    collectionsDocsDrop(topic: $topic, ids: $ids)
  }
`;
