import {
  ActionShape,
  CalculateMatchesReturnType,
  ContextShape,
  Effect,
  Exactly,
  Reducer,
  StateShape,
} from "./types";
import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  createChannel,
  createEffectsExecutor,
  createExecutor,
  createStore,
} from "./executors";
import { useSubscription } from "./utils";

export const useMachine = <
  S extends StateShape,
  A extends ActionShape,
  C extends ContextShape
>(
  reducer: Reducer<S, A, C>,
  initialState: S,
  initialContext?: C
) => {
  const store = useRef(createStore(initialState, initialContext ?? ({} as C)));
  const actionsChannel = useRef(createChannel<A>());
  const effectsChannel = useRef(createChannel<Effect<A>>());

  const send = useCallback((action: A) => {
    actionsChannel.current.send(action);
  }, []);

  useSubscription(
    () =>
      createExecutor(
        store.current,
        reducer,
        actionsChannel.current,
        effectsChannel.current
      ),
    [reducer]
  );

  useSubscription(() =>
    createEffectsExecutor(store.current, effectsChannel.current, send)
  );

  const state = useSyncExternalStore(
    store.current.subscribe,
    store.current.getStore
  );

  const fullState = { ...state.state, ctx: state.ctx };

  type MatchesArgShape = {
    [key in S["name"]]?: (state: Extract<S, { name: key }> & { ctx: C }) => any;
  };

  const matches = <T extends MatchesArgShape>(
    arg: Exactly<MatchesArgShape, T>
  ): CalculateMatchesReturnType<T, MatchesArgShape> => {
    const match = arg[state.state.name as S["name"]];

    if (!match) {
      return null as never;
    }

    // using casting here because we know this is correct
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return (match as any)(fullState as never);
  };

  return {
    state: {
      ...state.state,
      ctx: state.ctx,
    },
    send,
    matches,
  };
};
