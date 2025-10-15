// import { trimEndBase } from "../utils/trim-end-base";
import { PRODUCTION } from "./vars.env";

export const APP_NAME = "200-ngapp";
export const ADMIN_EMAIL = "admin@nikolav.rs";

export const URL_APP_PUBLIC_production = "https://nikolav.rs/";
export const URL_APP_PUBLIC_dev = "http://localhost:4200/";
export const URL_APP_PUBLIC = PRODUCTION
  ? URL_APP_PUBLIC_production
  : URL_APP_PUBLIC_dev;

export const DEFAULT_NO_IMAGE_AVAILABLE = "/no-image.jpg";

export const VIBER_WEBHOOK_PATH = "webhook_viber_channel";
