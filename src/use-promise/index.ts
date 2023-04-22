import { useCallback, useEffect } from "react";
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
    }
  };

export function usePromise<V>(
  promise: () => Promise<V>,
  config = { autoInvoke: true }
) {
  const { state, send, matches } = useMachine(reducer(promise), {
    name: "idle",
  });

  useEffect(() => {
    if (config.autoInvoke) {
      send({ type: "start" });
    }
  }, []);

  const start = useCallback(() => {
    send({ type: "start" });
  }, [promise, send]);

  const cancel = useCallback(() => {
    send({ type: "cancel" });
  }, [send]);

  return {
    state,
    start,
    cancel,
    matches,
  };
}
