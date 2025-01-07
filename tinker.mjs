import minimist from "minimist";

console.log(
  minimist("-x 1 --title=foo bar".split(/\s+/g))
);
