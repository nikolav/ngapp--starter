import { escapeRegex } from "./escape-regex";
export const trimEndBase = (text: string, charsRight: string) => {
  const m = text.match(new RegExp(`^(.*?)[${escapeRegex(charsRight)}]+$`));
  return m ? m[1] : text;
};
