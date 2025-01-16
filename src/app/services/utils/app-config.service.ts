import { Injectable } from "@angular/core";
import {
  PRODUCTION,
  API_URL_production,
  API_URL_dev,
  API_URL,
  ENDPOINT_GRAPHQL,
  KEY_ACCESS_TOKEN,
} from "../../config";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  FOO = "BAR";
  DEMO = "DEMO:1";
  //
  PRODUCTION = PRODUCTION;
  API_URL_dev = API_URL_dev;
  API_URL_production = API_URL_production;
  API_URL = API_URL;
  ENDPOINT_GRAPHQL = ENDPOINT_GRAPHQL;

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
    EVENT_APP_MOUNTED: "EVENT_APP_MOUNTED:31d93474-ddaa-5fe8-ad8a-41ddd01e4ebf",
  };
}
