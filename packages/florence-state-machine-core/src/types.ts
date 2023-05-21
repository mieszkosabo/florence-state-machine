export type Observable<T> = {
  subscribe: (cb: (val: T) => void) => () => void;
};

export const isObservable = <Event>(
  arg: EffectReturnType<Event>
): arg is Observable<Event> | Promise<Observable<Event>> => {
  if (!arg) {
    return false;
  }
  return typeof arg === "object" && "subscribe" in arg;
};

type EffectReturnType<Event> = ReturnType<Effect<Event>>;

export type Effect<Event> =
  | (() => Event)
  | (() => Promise<Event>)
  | (() => void)
  | (() => Promise<void>)
  | (() => Observable<Event>)
  | (() => Promise<Observable<Event>>);

export type StateShape = Exclude<
  {
    name: string;
  },
  "ctx"
>;

export type ContextShape = Record<string, unknown>;

export type EventShape = {
  type: string;
  payload?: any;
};

export type Reducer<
  State extends StateShape,
  Event extends EventShape,
  Context extends ContextShape = Record<string, unknown>
> = (
  state: State & { ctx: Context },
  event: Event
) =>
  | State
  | (State & { ctx: Context })
  | [State, Effect<Event>]
  | [State & { ctx: Context }, Effect<Event>];

type AnyFun = (...args: any[]) => any;

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

export type CalculateMatchesReturnType<
  T extends Record<string, AnyFun | undefined>,
  U extends Record<string, AnyFun | undefined>
> = Equals<keyof T, keyof U> extends true
  ? ReturnType<Extract<T[keyof T], AnyFun>>
  : ReturnType<Extract<T[keyof T], AnyFun>> | null;

type Impossible<T extends keyof any> = {
  [key in T]: never;
};

export type Exactly<T, U extends T = T> = U &
  Impossible<Exclude<keyof U, keyof T>>;
