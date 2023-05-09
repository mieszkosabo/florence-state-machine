import { EventShape, ContextShape, Effect, Reducer, StateShape } from "./types";
import { isDifferentObjShallow, isDifferentStateShallow } from "./utils";

export type Channel<Message> = {
  subscribe: (cb: (m: Message) => void) => () => void;
  send: (m: Message) => void;
};

export const createChannel = <Message>(): Channel<Message> => {
  const subscribers = new Set<(m: Message) => void>();

  const subscribe = (cb: (m: Message) => void) => {
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  };

  const send = (m: Message) => {
    subscribers.forEach((cb) => cb(m));
  };

  return {
    subscribe,
    send,
  };
};

const getNewId = (oldId: number) => {
  return oldId + 1;
};

const createInitialStoreSnapshot = <
  St extends StateShape,
  C extends ContextShape
>(
  initialState: St,
  initialCtx: C
) => ({
  _id: 0,
  state: initialState,
  ctx: initialCtx,
});

export const createStore = <St extends StateShape, C extends ContextShape>(
  initialState: St,
  initialCtx: C
) => {
  let store = createInitialStoreSnapshot(initialState, initialCtx);

  const subscribers = new Set<() => void>();
  const notifySubscribers = () => {
    subscribers.forEach((cb) => {
      cb();
    });
  };

  const getStore = () => store;

  const setState = (newState: St) => {
    store = {
      ...store,
      state: newState,
      // only change id when state changes, not when context changes
      _id: getNewId(store._id),
    };
    notifySubscribers();
  };

  const setContext = (newCtx: C) => {
    store = {
      ...store,
      ctx: newCtx,
    };
    notifySubscribers();
  };

  const subscribe = (cb: () => void) => {
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  };

  return {
    getStore,
    setState,
    setContext,
    subscribe,
  };
};

export const createExecutor = <
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
>(
  store: ReturnType<typeof createStore<St, C>>,
  reducer: Reducer<St, Ev, C>,
  actionsChannel: Channel<Ev>,
  effectsChannel: Channel<Effect<Ev>>
) => {
  return actionsChannel.subscribe((event) => {
    const { state: oldState, ctx: oldCtx } = store.getStore();
    const result = reducer({ ...oldState, ctx: oldCtx }, event);

    if (Array.isArray(result)) {
      const [nextState, effect] = result;

      if ("ctx" in nextState) {
        const { ctx, ...state } = nextState;
        if (isDifferentStateShallow(state as unknown as St, oldState)) {
          store.setState(state as unknown as St);
        }
        if (isDifferentObjShallow(ctx, oldCtx)) {
          store.setContext(ctx);
        }
      } else {
        if (isDifferentStateShallow(nextState, oldState as unknown as St)) {
          store.setState(nextState);
        }
      }

      effectsChannel.send(effect);
    } else {
      if ("ctx" in result) {
        const { ctx, ...state } = result;

        if (isDifferentStateShallow(state as unknown as St, oldState)) {
          store.setState(state as unknown as St);
        }
        if (isDifferentObjShallow(ctx, oldCtx)) {
          store.setContext(ctx);
        }
      } else {
        if (isDifferentStateShallow(result, oldState as unknown as St)) {
          store.setState(result);
        }
      }
    }
  });
};

export const createEffectsExecutor = <
  St extends StateShape,
  Ev extends EventShape,
  C extends ContextShape
>(
  store: ReturnType<typeof createStore<St, C>>,
  effectsChannel: Channel<Effect<Ev>>,
  send: (event: Ev) => void
) => {
  return effectsChannel.subscribe((effect) => {
    const currentId = store.getStore()._id;
    effect()
      .then((a) => {
        if (currentId === store.getStore()._id) {
          send(a);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
};
