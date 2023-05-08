import { useCallback, useEffect } from "react";
import { Reducer, createMachine, useMachine } from "../core";

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

type Event<Value> =
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
    event: Event<V>
  ): ReturnType<Reducer<State<V>, Event<V>>> => {
    switch (state.name) {
      case "idle":
        switch (event.type) {
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
        switch (event.type) {
          case "cancel":
            return { name: "idle" };
          case "resolve":
            return { name: "resolved", value: event.payload };
          case "reject":
            return { name: "rejected", error: event.payload };
          default:
            return state;
        }
      case "rejected":
      case "resolved":
        switch (event.type) {
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
  const { state, send, matches } = useMachine(
    createMachine({
      reducer: reducer(promise),
      initialState: { name: "idle" } as const,
    })
  );

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
