import { Injectable } from "@angular/core";
import { APP_NAME, ADMIN_EMAIL } from "../../config/vars.env.public";
import {
  PRODUCTION,
  API_URL_production,
  API_URL_dev,
  API_URL,
  ENDPOINT_GRAPHQL,
  KEY_ACCESS_TOKEN,
} from "../../config";

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
    KEY_AUTH_PROFILE: "AUTH_PROFILE:6cc4d5a2-5585-58fc-8427-ca7067968ef1:",
  };
  events = {
    EVENT_APP_INIT: "EVENT_APP_INIT:76190ab4-54d8-50b8-8acf-e5fefffabbbb",
  };
  io = {
    IOEVENT_COLLECTIONS_UPSERT_prefix:
      "IOEVENT_COLLECTIONS_UPSERT:4bdc857d-e203-5503-af89-31f07c43cded:",
    IOEVENT_REDIS_CACHE_KEY_UPDATED_prefix:
      "IOEVENT_REDIS_CACHE_KEY_UPDATED:Hvtmg8LbKbeajKb:",
  };
  re = {};
}
