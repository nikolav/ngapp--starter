import minimist from 'minimist';

const re_wsg = /\s+/g;

export const parseShellArgs = (shellArgs: string) =>
  minimist(shellArgs.split(re_wsg));
