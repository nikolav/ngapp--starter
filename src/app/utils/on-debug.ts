import each from "lodash/each";

interface IDebugMessages {
  [message: string]: unknown;
}

export const onDebug = (messages: IDebugMessages) => {
  each(messages, (data, message) => {
    console.log("@DEBUG");
    console.log(message);
    console.log(data);
  });
};
