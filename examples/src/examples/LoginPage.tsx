import { useMachine } from "florence-state-machine";
import type { Reducer } from "florence-state-machine";
import { sleep } from "../utils";
import { P, match } from "ts-pattern";

export type Action =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "logout" }
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
  await sleep(1000);
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
    case "loading": {
      switch (action.type) {
        case "loginSuccess":
          return {
            name: "success",
            ctx: {
              username: "",
            },
          };
        case "loginError":
          return {
            name: "error",
            message: action.payload.message,
          };
        default:
          return state;
      }
    }
    case "error": {
      switch (action.type) {
        case "inputChange": {
          return {
            name: "idle",
            ctx: {
              username: action.payload,
            },
          };
        }
        default:
          return state;
      }
    }
    case "success": {
      switch (action.type) {
        case "logout":
          return { name: "idle" };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const reducerWithTsPattern: Reducer<State, Action, Context> = (state, action) =>
  // with ts-pattern we can match simultaneously on state.name and action.type!
  match<[State["name"], Action], ReturnType<Reducer<State, Action, Context>>>([
    state.name,
    action,
  ])
    .with(
      // in both idle and error state, we want to handle inputChange in the same way
      [P.union("idle", "error"), { type: "inputChange", payload: P.select() }],
      (username) => ({
        name: "idle",
        ctx: {
          username: username,
        },
      })
    )
    // only in idle state we want to handle loginRequest
    .with(["idle", { type: "loginRequest" }], () => [
      {
        name: "loading",
      },
      () => requestLogin(state.ctx.username),
    ])
    // below, two possible events that can happen in loading state
    .with(["loading", { type: "loginSuccess" }], () => ({
      name: "success",
      ctx: {
        username: "",
      },
    }))
    .with(
      ["loading", { type: "loginError", payload: P.select() }],
      (error) => ({
        name: "error",
        message: error.message,
      })
    )
    // nice and simple case for logout event -> only possible in success state
    .with(["success", { type: "logout" }], () => ({ name: "idle" }))
    // a single, global "default" case for all other combinations of states and events that we don't care about!
    .otherwise(() => state);

function LoginPage() {
  const { state, send, matches } = useMachine(reducerWithTsPattern, {
    name: "idle",
  });

  if (state.name === "success") {
    return (
      <div>
        <h1>Login Success</h1>
        <button onClick={() => send({ type: "logout" })}>logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login page</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "320px",
          gap: "16px",
        }}
      >
        <input
          type="text"
          disabled={state.name === "loading"}
          onChange={(e) =>
            send({ type: "inputChange", payload: e.target.value })
          }
        />
        <button
          disabled={state.name === "error" || state.name === "loading"}
          onClick={() => send({ type: "loginRequest" })}
        >
          {matches({
            idle: () => "login",
            error: () => "login",
            loading: () => "loading...",
          })}
        </button>
        {matches({
          error: ({ message }) => <p style={{ color: "red" }}>{message}</p>,
        })}
      </div>
    </div>
  );
}

export default LoginPage;
