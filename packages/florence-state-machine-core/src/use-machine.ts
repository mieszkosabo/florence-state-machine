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
  createStore,
} from "./executors";
import { useSubscription } from "./utils";

export type CreateMachine = <
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
>(arg: {
  reducer: Reducer<St, Ev, C>;
  initialState: St;
  initialContext?: C;
}) => Machine<St, Ev, C>;

export const createMachine: CreateMachine = ({
  reducer,
  initialState,
  initialContext,
}) => ({
  reducer,
  initialState,
  initialContext,
});

export type Machine<
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
> = {
  reducer: Reducer<St, Ev, C>;
  initialState: St;
  initialContext?: C;
};

export const useMachine = <
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
>(
  machine: Machine<St, Ev, C>
) => {
  const store = useRef(
    createStore(machine.initialState, machine.initialContext ?? ({} as C))
  );
  const actionsChannel = useRef(createChannel<Ev>());
  const effectsChannel = useRef(createChannel<Effect<Ev>>());

  const send = useCallback((event: Ev) => {
    actionsChannel.current.send(event);
  }, []);

  useSubscription(
    () =>
      createExecutor(
        store.current,
        machine.reducer,
        actionsChannel.current,
        effectsChannel.current
      ),
    [machine.reducer]
  );

  useSubscription(() =>
    createEffectsExecutor(store.current, effectsChannel.current, send)
  );

  const state = useSyncExternalStore(
    store.current.subscribe,
    store.current.getStore,
    store.current.getStore
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
