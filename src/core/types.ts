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
