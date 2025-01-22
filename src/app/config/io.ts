import { SocketIoConfig } from "ngx-socket-io";
import { IO_SERVER } from "./vars.env";

// #https://github.com/rodgc/ngx-socket-io?tab=readme-ov-file#ngx-socket-io
export const configSocketIO: SocketIoConfig = {
  url: IO_SERVER,
  options: { withCredentials: true },
};
