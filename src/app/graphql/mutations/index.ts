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

// collectionsUpsert(topic: String!, data: JsonData!, fields: [String!]!, id: ID): JsonData!
export const M_collectionsUpsert = gql`
  mutation m_collectionsUpsert(
    $topic: String!
    $data: JsonData!
    $fields: [String!]!
    $id: ID
  ) {
    collectionsUpsert(topic: $topic, data: $data, fields: $fields, id: $id)
  }
`;

// collectionsDrop(topic: String!, ids: [ID!]): JsonData!
export const M_collectionsDrop = gql`
  mutation m_collectionsDrop($topic: String!, $ids: [ID!]) {
    collectionsDrop(topic: $topic, ids: $ids)
  }
`;

