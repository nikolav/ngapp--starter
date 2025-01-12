import { Config } from "tailwindcss";
import twTypography from "@tailwindcss/typography";

export default <Partial<Config>>{
  mode: "jit",
  content: [
    // scan .src*
    "./src/**/*.{html,ts,js,jsx,tsx}",
    // scan .docs*
    "./docs/www/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [twTypography],
};
