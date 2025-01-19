import { trimEndBase } from "../utils/trim-end-base";
import { PRODUCTION } from "./vars.env";

export const APP_NAME = "200-ngapp";
export const ADMIN_EMAIL = "admin@nikolav.rs";

export const URL_APP_PUBLIC_production = "https://nikolav.rs/";
export const URL_APP_PUBLIC_dev = "http://localhost:4200/";
export const URL_APP_PUBLIC = PRODUCTION
  ? // "https://qdeiymppite.web.app/"
    // "https://morning-ocean-24984-2ae2dd559da2.herokuapp.com/"
    URL_APP_PUBLIC_production
  : // "http://140.82.39.170/"
    // "https://nikolav.rs/"
    // ? "https://qdeiymppite.web.app/"
    URL_APP_PUBLIC_dev;

export const URL_PRODUCT_PREVIEW_HOST = URL_APP_PUBLIC;

const LOGGING: boolean = true;

export const THEME_ACCENT_SHIFT = 44;
export const DEBUG = !PRODUCTION && LOGGING;

export const URL_PASSWORD_RESET_FORM_LINK = `${trimEndBase(
  URL_APP_PUBLIC,
  "/"
)}/auth-password-reset-form`;

export const URL_VERIFY_EMAIL = `${trimEndBase(
  URL_APP_PUBLIC,
  "/"
)}/auth-verify-email`;

export { SSR } from "./vars.env";

export const DEFAULT_NO_IMAGE_AVAILABLE = "/no-image.jpg";
