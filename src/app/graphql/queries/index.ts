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

// awsUploadPresignedUrl(filename: String!, contentType: String!, key: String): JsonData!
export const Q_awsUploadPresignedUrl = gql`
  query q_awsUploadPresignedUrl(
    $filename: String!
    $contentType: String!
    $key: String
  ) {
    awsUploadPresignedUrl(
      filename: $filename
      contentType: $contentType
      key: $key
    )
  }
`;

// awsUploadDownloadUrl(key: String!, forceDownload: Boolean): JsonData!
export const Q_awsUploadDownloadUrl = gql`
  query q_awsUploadDownloadUrl($key: String!, $forceDownload: Boolean) {
    awsUploadDownloadUrl(key: $key, forceDownload: $forceDownload)
  }
`;

// awsUploadListObjects(prefix: String): JsonData!
export const Q_awsUploadListObjects = gql`
  query q_awsUploadListObjects($prefix: String) {
    awsUploadListObjects(prefix: $prefix)
  }
`;

// awsUploadObjectMetadata(key: String!): JsonData!
export const Q_awsUploadObjectMetadata = gql`
  query q_awsUploadObjectMetadata($key: String!) {
    awsUploadObjectMetadata(key: $key)
  }
`;
