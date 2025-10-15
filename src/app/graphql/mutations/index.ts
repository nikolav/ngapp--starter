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

// mailSendMessage(to: String!, subject: String!, template: String!, context: JsonData): JsonData!
export const M_mailSendMessage = gql`
  mutation m_mailSendMessage(
    $to: String!
    $subject: String!
    $template: String!
    $context: JsonData
  ) {
    mailSendMessage(
      to: $to
      subject: $subject
      template: $template
      context: $context
    )
  }
`;

// viberChannelSetupSetWebhook(url: String!, auth_token: String!, is_global: Boolean): JsonData!
export const M_viberChannelSetupSetWebhook = gql`
  mutation m_viberChannelSetupSetWebhook(
    $url: String!
    $auth_token: String!
    $is_global: Boolean
  ) {
    viberChannelSetupSetWebhook(
      url: $url
      auth_token: $auth_token
      is_global: $is_global
    )
  }
`;

// viberChannelSetupChannelsDrop(channels: [String!]): JsonData!
export const M_viberChannelSetupChannelsDrop = gql`
  mutation m_viberChannelSetupChannelsDrop($channels: [String!]) {
    viberChannelSetupChannelsDrop(channels: $channels)
  }
`;

// viberSendTextMessage(payload: JsonData!): JsonData!
export const M_viberSendTextMessage = gql`
  mutation m_viberSendTextMessage($payload: JsonData!) {
    viberSendTextMessage(payload: $payload)
  }
`;

// viberSendPictureMessage(payload: JsonData!): JsonData!
export const M_viberSendPictureMessage = gql`
  mutation m_viberSendPictureMessage($payload: JsonData!) {
    viberSendPictureMessage(payload: $payload)
  }
`;
