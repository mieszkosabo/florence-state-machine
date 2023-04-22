import { useEffect } from "react";
import { StateShape } from "./types";

export const isDifferentObjShallow = <T extends Record<string, unknown>>(
  o1: T,
  o2: T
) => {
  return Object.keys(o1).some((key) => o1[key] !== o2[key]);
};

export const isDifferentStateShallow = <S extends StateShape>(
  s1: S,
  s2: S
): boolean => {
  if (s1.name !== s2.name) {
    return true;
  }

  return isDifferentObjShallow(s1, s2);
};

export const useSubscription = (
  sub: () => () => void,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    const unsubscribe = sub();
    return () => {
      unsubscribe();
    };
  }, deps ?? []);
};
