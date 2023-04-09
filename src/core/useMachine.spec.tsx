import React, { useEffect } from "react";
import { describe, it, expect, vi } from "vitest";
import { Reducer } from "./types";
import { useMachine } from "./useMachine";
import { render, fireEvent, waitFor } from "@testing-library/react";

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

    fireEvent.change(await findByTestId("input"), {
      target: { value: "admin" },
    });
    fireEvent.click(await findByTestId("button"));

    expect((await findByTestId("state")).textContent).toBe("loading");
    await waitFor(async () =>
      expect((await findByTestId("state")).textContent).toBe("success")
    );

    expect(fn).toHaveBeenCalledTimes(4);
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

    fireEvent.click(await findByTestId("button-pong"));
    fireEvent.click(await findByTestId("button-ping"));
    fireEvent.click(await findByTestId("button-pong"));

    expect(fn).toHaveBeenCalledTimes(4);

    // fire event that doesn't change the state
    fireEvent.click(await findByTestId("button-pong"));
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
