import each from "lodash/each";

interface IDebugMessages {
  [message: string]: unknown;
}

const DEBUG_PREFIX = "@@DEBUG";

const styles = {
  prefix: "color:#6366f1;font-weight:700;", // indigo
  message: "color:#0f172a;font-weight:600;", // dark slate
  data: "color:#334155;", // muted slate
  meta: "color:#64748b;font-size:12px;", // gray
};

export const onDebug = (messages: IDebugMessages) => {
  each(messages, (data, message) => {
    const timestamp = new Date().toISOString();

    console.groupCollapsed(
      `%c${DEBUG_PREFIX}%c ${message}`,
      styles.prefix,
      styles.message
    );

    console.log("%cData:", styles.meta, data);
    // console.table(data as Record<string, unknown>);
    console.log("%cTimestamp:", styles.meta, timestamp);

    console.groupEnd();
  });
};
