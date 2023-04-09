import { ActionShape, ContextShape, Reducer, StateShape } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";

type Effect<A extends ActionShape> = () => Promise<A>;

const isDifferentObjShallow = <T extends Record<string, unknown>>(
  o1: T,
  o2: T
) => {
  return Object.keys(o1).some((key) => o1[key] !== o2[key]);
};

const isDifferentStateShallow = <S extends StateShape>(
  s1: S,
  s2: S
): boolean => {
  if (s1.name !== s2.name) {
    return true;
  }

  return isDifferentObjShallow(s1, s2);
};

// TODO: by default the effect's result should be discarded if the state changed in the meantime.
export const useMachine = <
  S extends StateShape,
  A extends ActionShape,
  C extends ContextShape
>(
  reducer: Reducer<S, A, C>,
  initialState: S,
  initialContext?: C
): { state: S & { ctx: C }; send: (action: A) => void } => {
  const [context, setContext] = useState<C>(initialContext ?? ({} as C));
  const [state, setState] = useState<S>(initialState);
  const [effectQueue, setEffectQueue] = useState<Effect<A>[]>([]);

  const stateWithCtx = useMemo(
    () => ({ ...state, ctx: context }),
    [state, context]
  );

  const send = useCallback(
    (action: A) => {
      const result = reducer(stateWithCtx, action);
      const { ctx: oldCtx, ...oldState } = stateWithCtx;

      if (Array.isArray(result)) {
        const [nextState, effect] = result;

        if ("ctx" in nextState) {
          const { ctx, ...state } = nextState;
          if (isDifferentStateShallow(state, oldState)) {
            setState(state as unknown as S);
          }
          if (isDifferentObjShallow(ctx, oldCtx)) {
            setContext(ctx);
          }
        } else {
          if (isDifferentStateShallow(nextState, oldState as unknown as S)) {
            setState(nextState);
          }
        }

        setEffectQueue((q) => [...q, effect]);
      } else {
        if ("ctx" in result) {
          const { ctx, ...state } = result;

          if (isDifferentStateShallow(state, oldState)) {
            setState(state as unknown as S);
          }
          if (isDifferentObjShallow(ctx, oldCtx)) {
            setContext(ctx);
          }
        } else {
          if (isDifferentStateShallow(result, oldState as unknown as S)) {
            setState(result);
          }
        }
      }
    },
    [stateWithCtx, setEffectQueue]
  );

  useEffect(() => {
    const currEff = effectQueue[0];
    if (currEff) {
      currEff()
        .then(send)
        .catch((e) => console.error(e));
      setEffectQueue((q) => q.slice(1));
    }
  }, [effectQueue, send, stateWithCtx]);

  return {
    state: stateWithCtx,
    send,
  };
};
