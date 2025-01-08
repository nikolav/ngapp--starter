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
}
