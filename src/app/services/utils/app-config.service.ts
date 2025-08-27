import { Injectable } from "@angular/core";
import { APP_NAME, ADMIN_EMAIL } from "../../config/vars.env.public";
import {
  PRODUCTION,
  API_URL_production,
  API_URL_dev,
  API_URL,
  ENDPOINT_GRAPHQL,
  KEY_ACCESS_TOKEN,
  APP_ID,
} from "../../config";
import { TOKEN_foo, TOKEN_localStorage } from "../../keys";

const withTimestamps = (ls: any[]) => [...ls, "created_at", "updated_at"];

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  FOO = "BAR";
  //
  APP_NAME = APP_NAME;
  ADMIN_EMAIL = ADMIN_EMAIL;
  //
  PRODUCTION = PRODUCTION;
  API_URL_dev = API_URL_dev;
  API_URL_production = API_URL_production;
  API_URL = API_URL;
  ENDPOINT_GRAPHQL = ENDPOINT_GRAPHQL;

  app = {
    PROCESSING: `PROCESSING:510e66b5-2880-5c7a-ae49-aa2f191d2bcc`,
    ROUTE_PATH_REDIRECT_UNATHENTICATED: "/",
  };
  // collections:config:mongo
  collections = {
    foobars: {
      topic: "foobars",
      fields: withTimestamps(["foo", "bar"]),
      sort: "date_desc",
    },
    main: {
      topic: "main",
      fields: withTimestamps(["name", "value"]),
      // sort: "date_desc",
    },
    logs: {
      topic: "logs:4f0c506a-7d37-5996-981b-e6fe3d73d370",
      fields: withTimestamps(["message"]),
      sort: "date_desc",
    },
  };
  graphql = {
    // ~10min autoreload*
    QUERY_POLL_INTERVAL: 712345,
  };
  stores = {
    auth: {
      KEY_ACCESS_TOKEN,
    },
  };
  key = {
    COLLECTIONS_DOCS_UPDATED:
      "COLLECTIONS_DOCS_UPDATED:af973ced-7b7e-5678-8036-db2c3bdcb5e2:",
    AUTH_PROFILE: "AUTH_PROFILE:6cc4d5a2-5585-58fc-8427-ca7067968ef1:",
    APP_REMOTE_CONFIG: `KEY_APP_REMOTE_CONFIG:dd107db3-c14d-5357-9364-568b61c444e8:${APP_ID}`,
    IS_ACTIVE_APP_SIDENAV: "mUYzNU:b7943cb8-b3d4-5921-af05-bfc0b1a36c68",
    CLOUD_MESSAGING_TOKENS:
      "CLOUD_MESSAGING_TOKENS:8cffac51-4e75-5a86-a9b2-a4c5f702b5b0",
    STORAGE: "STORAGE:0a9496fc-21c9-582c-9d6b-b68419132557",
  };
  events = {
    STORAGE_CHANGE: "STORAGE_CHANGE:c4d1fdfb-8f17-5cff-9dd1-900172f9ad25",
    EVENT_APP_INIT: "EVENT_APP_INIT:76190ab4-54d8-50b8-8acf-e5fefffabbbb",
    ROUTER_NAVIGATION_START:
      "ROUTER_NAVIGATION_START:1dd152a5-7d3e-5e9d-bf6c-85bb555e3503",
    ROUTER_NAVIGATION_END:
      "ROUTER_NAVIGATION_END:129bd9cd-ac1d-5679-81dc-eeb943fe5e70",
  };
  io = {
    IOEVENT_COLLECTIONS_UPSERT_prefix:
      "IOEVENT_COLLECTIONS_UPSERT:4bdc857d-e203-5503-af89-31f07c43cded:",
    IOEVENT_REDIS_CACHE_KEY_UPDATED_prefix:
      "IOEVENT_REDIS_CACHE_KEY_UPDATED:Fx8FtARWgQ:",
  };
  re = {};
  // di tokens
  di = {
    TOKEN_foo,
    TOKEN_localStorage,
  };
}
