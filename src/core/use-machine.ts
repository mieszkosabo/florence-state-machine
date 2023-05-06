import {
  EventShape,
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
  createInitialStoreSnapshot,
  createStore,
} from "./executors";
import { useSubscription } from "./utils";

export const useMachine = <
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
>(
  reducer: Reducer<St, Ev, C>,
  initialState: St,
  initialContext?: C
) => {
  const store = useRef(createStore(initialState, initialContext ?? ({} as C)));
  const actionsChannel = useRef(createChannel<Ev>());
  const effectsChannel = useRef(createChannel<Effect<Ev>>());

  const send = useCallback((event: Ev) => {
    actionsChannel.current.send(event);
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
    store.current.getStore,
    () => createInitialStoreSnapshot(initialState, initialContext ?? ({} as C))
  );

  const fullState = { ...state.state, ctx: state.ctx };

  type MatchesArgShape = {
    [key in St["name"]]?: (
      state: Extract<St, { name: key }> & { ctx: C }
    ) => any;
  };

  const matches = <T extends MatchesArgShape>(
    arg: Exactly<MatchesArgShape, T>
  ): CalculateMatchesReturnType<T, MatchesArgShape> => {
    const match = arg[state.state.name as St["name"]];

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
