import React, { useEffect } from "react";
import { describe, it, expect, vi, assertType } from "vitest";
import { Reducer } from "./types";
import { useMachine } from "./use-machine";
import { render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestLogin = async (username: string): Promise<Action> => {
  await sleep(50);
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
    const input = await findByTestId("input");
    const button = await findByTestId("button");
    const state = await findByTestId("state");

    expect(state.textContent).toBe("idle");

    await user.type(input, "admin");
    await user.click(button);

    expect(state.textContent).toBe("loading");
    await waitFor(() => expect(state.textContent).toBe("success"));

    expect(fn).toHaveBeenCalledTimes(8);
  });

  it("re-renders only when state changes", async () => {
    type Action = { type: "ping" } | { type: "pong" };
    type State = { name: "ping" } | { name: "pong" };
    const reducer: Reducer<State, Action> = (state, action) => {
      switch (state.name) {
        case "ping":
          switch (action.type) {
            case "pong":
              return { name: "pong" };
            default:
              return state;
          }
        case "pong":
          switch (action.type) {
            case "ping":
              return { name: "ping" };
            default:
              return state;
          }
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
    const pingButton = await findByTestId("button-ping");
    const pongButton = await findByTestId("button-pong");

    await user.click(pongButton);
    await user.click(pingButton);
    await user.click(pongButton);

    expect(fn).toHaveBeenCalledTimes(4);

    // fire event that doesn't change the state
    await user.click(pongButton);
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
                setTimeout(() => resolve({ type: "increment" }), 25)
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
      );

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
                    setTimeout(() => resolve({ type: "ready" }), 50)
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

  it("basic matches", async () => {
    function App() {
      const { state, send, matches } = useMachine(reducer, {
        name: "idle",
      });

      return (
        <div>
          <div data-testid="state">{state.name}</div>
          {matches({
            idle: () => <div data-testid="idle">idle</div>,
            error: () => <div data-testid="error">error</div>,
            loading: () => <div data-testid="loading">loading</div>,
            success: () => <div data-testid="success">success</div>,
          })}
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
    const input = await findByTestId("input");
    const button = await findByTestId("button");
    const state = await findByTestId("state");

    expect(state.textContent).toBe("idle");
    expect((await findByTestId("idle")).textContent).toBe("idle");

    await user.type(input, "admin");
    await user.click(button);

    expect(state.textContent).toBe("loading");
    await waitFor(() => expect(state.textContent).toBe("success"));
    expect((await findByTestId("success")).textContent).toBe("success");
  });

  it("matches has correct type", () => {
    const { result } = renderHook(() =>
      useMachine(reducer, {
        name: "idle",
      })
    );
    const { matches } = result.current;

    // matches with no branches always gives us null
    const val1 = matches({});
    assertType<null>(val1);
    expect(val1).toBe(null);

    // matches with some, but not all branches gives us the union
    // or branches' return values and null (for the missing ones)
    const val2 = matches({
      idle: () => "hello",
      loading: () => 42 as const,
    });
    assertType<42 | string | null>(val2);
    assertType<Extract<typeof val2, null>>(null);
    expect(val2).toBe("hello");

    // matches with all branches gives us the union of branches' return values
    const val3 = matches({
      idle: () => "hello",
      error: () => "world",
      loading: () => 42 as const,
      success: () => true,
    });
    assertType<42 | string | boolean>(val3);

    // matches won't accept branches that don't match state names
    matches({
      idle: () => "hello",
      error: () => "world",
      loading: () => 42 as const,

      // @ts-expect-error - this branch doesn't match any state name
      asdfasdf: () => true,
    });
  });
});
