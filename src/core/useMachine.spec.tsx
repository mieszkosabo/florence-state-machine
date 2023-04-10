import React, { useEffect } from "react";
import { describe, it, expect, vi } from "vitest";
import { Reducer } from "./types";
import { useMachine } from "./useMachine";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type Action =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "loginSuccess" }
  | { type: "loginError"; payload: { message: string } };

type State =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "success" };

type Context = {
  username: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestLogin = async (username: string): Promise<Action> => {
  await sleep(5);
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

describe("useMachine", () => {
  const user = userEvent.setup();
  it("example with a single effect", async () => {
    const fn = vi.fn();

    function App() {
      const { state, send } = useMachine(reducer, {
        name: "idle",
      });

      useEffect(() => {
        // count number of re-renders
        fn();
      }, [state, send]);

      return (
        <div>
          <div data-testid="state">{state.name}</div>
          <input
            data-testid="input"
            onChange={(e) =>
              send({ type: "inputChange", payload: e.target.value })
            }
          />
          <button
            data-testid="button"
            onClick={() => send({ type: "loginRequest" })}
          >
            Login
          </button>
        </div>
      );
    }

    const { findByTestId } = render(<App />);

    expect((await findByTestId("state")).textContent).toBe("idle");

    await user.type(await findByTestId("input"), "admin");
    await user.click(await findByTestId("button"));

    expect((await findByTestId("state")).textContent).toBe("loading");
    await waitFor(async () =>
      expect((await findByTestId("state")).textContent).toBe("success")
    );

    expect(fn).toHaveBeenCalledTimes(8);
  });

  it("re-renders only when state changes", async () => {
    type Action = { type: "ping" } | { type: "pong" };
    type State = { name: "ping" } | { name: "pong" };
    const reducer: Reducer<State, Action> = (state, action) => {
      switch (action.type) {
        case "ping":
          return { name: "ping" };
        case "pong":
          return { name: "pong" };
        default:
          return state;
      }
    };

    const fn = vi.fn();

    function App() {
      const result = useMachine(reducer, { name: "ping" } as const);
      useEffect(() => {
        // call the function to track the number of re-renders
        fn();
      }, [result]);

      return (
        <div>
          <div data-testid="state">{result.state.name}</div>
          <button
            data-testid="button-ping"
            onClick={() => result.send({ type: "ping" })}
          >
            Ping
          </button>
          <button
            data-testid="button-pong"
            onClick={() => result.send({ type: "pong" })}
          >
            Pong
          </button>
        </div>
      );
    }

    const { findByTestId } = render(<App />);

    await user.click(await findByTestId("button-pong"));
    await user.click(await findByTestId("button-ping"));
    await user.click(await findByTestId("button-pong"));

    expect(fn).toHaveBeenCalledTimes(4);

    // fire event that doesn't change the state
    await user.click(await findByTestId("button-pong"));
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("async context changes work along side state changes", async () => {
    type Action = { type: "increment" } | { type: "asyncIncrement" };
    type State = { name: "default" };
    type Context = { counter: number };

    const reducer: Reducer<State, Action, Context> = (state, action) => {
      switch (action.type) {
        case "increment":
          return { name: "default", ctx: { counter: state.ctx.counter + 1 } };
        case "asyncIncrement":
          return [
            { name: "default", ctx: { counter: state.ctx.counter } },
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ type: "increment" }), 20)
              ),
          ];
        default:
          return state;
      }
    };

    function App() {
      const result = useMachine(
        reducer,
        {
          name: "default",
        } as const,
        { counter: 0 }
      ); // FIXME: check if you dont have to write as const

      return (
        <div>
          <div data-testid="counter">{result.state.ctx.counter}</div>
          <button
            data-testid="inc"
            onClick={() => {
              result.send({ type: "increment" });
            }}
          >
            inc
          </button>
          <button
            data-testid="async-inc"
            onClick={() => {
              result.send({ type: "asyncIncrement" });
            }}
          >
            async inc
          </button>
        </div>
      );
    }

    const { findByTestId } = render(<App />);
    const incButton = await findByTestId("inc");
    const asyncIncButton = await findByTestId("async-inc");
    const counter = await findByTestId("counter");

    expect(counter.textContent).toBe("0");
    await user.click(incButton);
    await user.click(incButton);
    await user.click(incButton);
    expect(counter.textContent).toBe("3");

    await user.click(asyncIncButton);
    await user.click(incButton);
    await user.click(incButton);
    await waitFor(() => expect(counter.textContent).toBe("6"));
  });

  it("discards results of effects that were fired before the state changed", async () => {
    type Action =
      | { type: "load" }
      | { type: "ready" }
      | { type: "reset" }
      | { type: "cancel" };
    type State = { name: "idle" } | { name: "loading" } | { name: "loaded" };

    const reducer: Reducer<State, Action> = (state, action) => {
      switch (state.name) {
        case "idle": {
          switch (action.type) {
            case "load":
              return [
                { name: "loading" },
                () =>
                  new Promise((resolve) =>
                    setTimeout(() => resolve({ type: "ready" }), 20)
                  ),
              ];
            case "ready":
              return { name: "loaded" };
            default:
              return state;
          }
        }
        case "loading": {
          switch (action.type) {
            case "ready":
              return { name: "loaded" };
            case "reset":
            case "cancel":
              return { name: "idle" };
            default:
              return state;
          }
        }
        case "loaded": {
          switch (action.type) {
            case "reset":
              return { name: "idle" };
            default:
              return state;
          }
        }
      }
    };

    function App() {
      const result = useMachine(reducer, { name: "idle" } as const);

      return (
        <div>
          <div data-testid="state">{result.state.name}</div>
          <button
            data-testid="load"
            onClick={() => result.send({ type: "load" })}
          >
            Ping
          </button>
          <button
            data-testid="cancel"
            onClick={() => result.send({ type: "cancel" })}
          >
            Pong
          </button>
          <button
            data-testid="reset"
            onClick={() => result.send({ type: "reset" })}
          >
            Pong
          </button>
        </div>
      );
    }

    const { findByTestId } = render(<App />);
    const loadButton = await findByTestId("load");
    const cancelButton = await findByTestId("cancel");
    const resetButton = await findByTestId("reset");
    const state = await findByTestId("state");

    // non-interrupted flow
    await user.click(loadButton);
    expect(state.textContent).toBe("loading");
    await waitFor(() => expect(state.textContent).toBe("loaded"));
    await user.click(resetButton);
    expect(state.textContent).toBe("idle");

    // interrupted flow
    await user.click(loadButton);
    expect(state.textContent).toBe("loading");
    await user.click(cancelButton);
    expect(state.textContent).toBe("idle");
    // check that the effect was not executed after the state changed
    await sleep(25);
    expect(state.textContent).toBe("idle");
  });
});
