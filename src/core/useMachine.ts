import {
  ActionShape,
  ContextShape,
  Effect,
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

type Matches<S extends StateShape, C extends ContextShape> = (arg: {
  [key in S["name"]]: (state: Extract<S, { name: key }> & { ctx: C }) => any;
}) => any;

export const useMachine = <
  S extends StateShape,
  A extends ActionShape,
  C extends ContextShape
>(
  reducer: Reducer<S, A, C>,
  initialState: S,
  initialContext?: C
): {
  state: S & { ctx: C };
  send: (action: A) => void;
  matches: Matches<S, C>;
} => {
  const store = useRef(createStore(initialState, initialContext ?? ({} as C)));
  const actionsChannel = useRef(createChannel<A>());
  const effectsChannel = useRef(createChannel<Effect<A>>());

  const send = useCallback((action: A) => {
    actionsChannel.current.send(action);
  }, []);

  useSubscription(() =>
    createExecutor(
      store.current,
      reducer,
      actionsChannel.current,
      effectsChannel.current
    )
  );

  useSubscription(() =>
    createEffectsExecutor(store.current, effectsChannel.current, send)
  );

  const state = useSyncExternalStore(
    store.current.subscribe,
    store.current.getStore
  );

  const fullState = { ...state.state, ctx: state.ctx };

  const matches = (arg: Parameters<Matches<S, C>>[0]) =>
    // using casting here because we know this is correct
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    arg[state.state.name as S["name"]](fullState as never);

  return {
    state: {
      ...state.state,
      ctx: state.ctx,
    },
    send,
    matches,
  };
};
