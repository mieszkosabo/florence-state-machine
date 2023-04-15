import { useMachine } from "florence-state-machine";
import type { Reducer } from "florence-state-machine";
import { sleep } from "../utils";

export type Action =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "loginSuccess" }
  | { type: "loginError"; payload: { message: string } };

export type State =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "success" };

export type Context = {
  username: string;
};

const requestLogin = async (username: string): Promise<Action> => {
  await sleep(500);
  if (username === "admin") {
    return { type: "loginSuccess" };
  }
  return {
    type: "loginError",
    payload: { message: "Invalid username" },
  };
};

export const reducer: Reducer<State, Action, Context> = (state, action) => {
  switch (state.name) {
    case "idle": {
      switch (action.type) {
        case "inputChange":
          return {
            name: "idle",
            ctx: {
              username: action.payload,
            },
          };
        case "loginRequest":
          return [
            {
              name: "loading",
            },
            () => requestLogin(state.ctx.username),
          ];
        default:
          return state;
      }
    }
    case "loading":
      switch (action.type) {
        case "loginSuccess":
          return {
            name: "success",
          };
        case "loginError":
          return {
            name: "error",
            message: action.payload.message,
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

function LoginPage() {
  const { state, send } = useMachine(reducer, { name: "idle" });

  switch (state.name) {
    case "idle":
      return (
        <div>
          <input
            type="text"
            onChange={(e) =>
              send({ type: "inputChange", payload: e.target.value })
            }
          />
          <button onClick={() => send({ type: "loginRequest" })}>login</button>
        </div>
      );
    case "loading":
      return <div>loading...</div>;
    case "error":
      return (
        <div>
          <p>error!</p>
          <p>{state.message}</p>
        </div>
      );
    case "success":
      return (
        <div>
          <p>success!</p>
        </div>
      );
  }
}

export default LoginPage;
