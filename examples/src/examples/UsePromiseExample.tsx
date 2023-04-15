import { useState } from "react";
import { usePromise } from "florence-state-machine";

const echo = (value: string): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });

export const UsePromiseExample = () => {
  const [text, setText] = useState("hello");
  const { state, matches, cancel, start } = usePromise(() => echo(text), {
    autoInvoke: false,
  });

  console.log("state: ", state);

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button onClick={start}>load echo</button>
      {matches({
        pending: () => (
          <>
            <p>pending...</p>
            <button onClick={cancel}>cancel</button>
          </>
        ),
        rejected: ({ error }) => <p>error: {error.message}</p>,
        resolved: ({ value }) => <p>echo: {value}</p>,
      })}
    </div>
  );
};
