import { useCallback } from "react";
import { Reducer, useMachine } from "../core";

type State<Value> =
  | {
      name: "idle";
    }
  | {
      name: "pending";
    }
  | {
      name: "resolved";
      value: Value;
    }
  | {
      name: "rejected";
      error: Error;
    };

type Action<Value> =
  | {
      type: "start";
    }
  | {
      type: "cancel";
    }
  | {
      type: "resolve";
      payload: Value;
    }
  | {
      type: "reject";
      payload: Error;
    };

export const reducer =
  <V>(promise: () => Promise<V>) =>
  (
    state: State<V>,
    action: Action<V>
  ): ReturnType<Reducer<State<V>, Action<V>>> => {
    switch (state.name) {
      case "idle":
        switch (action.type) {
          case "start":
            return [
              { name: "pending" },
              () =>
                promise()
                  .then(
                    (value) => ({ type: "resolve", payload: value } as const)
                  )
                  .catch((error) => ({
                    type: "reject",
                    payload:
                      error instanceof Error
                        ? error
                        : new Error(error as string),
                  })),
            ];
          default:
            return state;
        }
      case "pending":
        switch (action.type) {
          case "cancel":
            return { name: "idle" };
          case "resolve":
            return { name: "resolved", value: action.payload };
          case "reject":
            return { name: "rejected", error: action.payload };
          default:
            return state;
        }
      case "rejected":
      case "resolved":
        switch (action.type) {
          case "start":
            return { name: "pending" };
          default:
            return state;
        }
    }
  };

type MakeOptional<T, Keys> = { [K in Extract<keyof T, Keys>]?: T[K] } & {
  [K in Exclude<keyof T, Keys>]: T[K];
};

type Matches<V> = (
  arg: MakeOptional<
    {
      [key in State<V>["name"]]: (
        state: Extract<State<V>, { name: key }>
      ) => JSX.Element | null;
    },
    "idle"
  >
) => JSX.Element | null;

export function usePromise<V>(promise: () => Promise<V>): {
  state: State<V>;
  cancel: () => void;
  matches: Matches<V>;
};
export function usePromise<V>(
  promise: () => Promise<V>,
  config: { autoInvoke: false }
): {
  state: State<V>;
  start: () => void;
  cancel: () => void;
  matches: Matches<V>;
};

export function usePromise<V>(
  promise: () => Promise<V>,
  config = { autoInvoke: true }
):
  | {
      state: State<V>;
      start: () => void;
      cancel: () => void;
      matches: Matches<V>;
    }
  | { state: State<V>; cancel: () => void; matches: Matches<V> } {
  const { state, send } = useMachine(reducer(promise), { name: "idle" });

  const start = useCallback(() => {
    send({ type: "start" });
    promise()
      .then((value) => send({ type: "resolve", payload: value }))
      .catch((error) => send({ type: "reject", payload: error as Error }));
  }, [promise, send]);

  const cancel = useCallback(() => {
    send({ type: "cancel" });
  }, [send]);

  const matches = useCallback(
    (arg: Parameters<Matches<V>>[0]) => {
      const func = arg[state.name];
      if (func) {
        return func(state as never);
      }
      return null;
    },
    [state.name]
  );

  if (config.autoInvoke) {
    return {
      state,
      cancel,
      matches,
    };
  }

  return {
    state,
    start,
    cancel,
    matches,
  };
}
