export type Effect<Action> = () => Promise<Action>;

export type StateShape = Exclude<
  {
    name: string;
  },
  "ctx"
>;

export type ContextShape = Record<string, unknown>;

export type ActionShape = {
  type: string;
  payload?: any;
};

export type Reducer<
  State extends StateShape,
  Action extends ActionShape,
  Context extends ContextShape = Record<string, unknown>
> = (
  state: State & { ctx: Context },
  action: Action
) =>
  | State
  | (State & { ctx: Context })
  | [State, Effect<Action>]
  | [State & { ctx: Context }, Effect<Action>];

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
