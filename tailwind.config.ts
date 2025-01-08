import { Config } from "tailwindcss";
import twTypography from "@tailwindcss/typography";

export default <Partial<Config>>{
  mode: "jit",
  content: ["./src/**/*.{html,ts,js,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [twTypography],
};
