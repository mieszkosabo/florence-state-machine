import { Effect, Reducer, useMachine } from "florence-state-machine";

type Event =
  | { type: "start" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick" };

type State = { name: "idle" } | { name: "running" } | { name: "paused" };

type Context = {
  currentTime: number;
};

const tick: Effect<Event> = () =>
  new Promise((resolve) => setTimeout(() => resolve({ type: "tick" }), 100));

const reducer: Reducer<State, Event, Context> = (state, event) => {
  switch (state.name) {
    case "idle":
      switch (event.type) {
        case "start":
          return [{ name: "running" }, tick];
        default:
          return state;
      }
    case "running":
      switch (event.type) {
        case "pause":
          return { name: "paused" };
        case "reset":
          return { name: "idle", ctx: { currentTime: 0 } };
        case "tick":
          return [
            {
              name: "running",
              ctx: { currentTime: state.ctx.currentTime + 0.1 },
            },
            tick,
          ];
        default:
          return state;
      }
    case "paused":
      switch (event.type) {
        case "start":
          return [{ name: "running" }, tick];
        case "reset":
          return { name: "idle", ctx: { currentTime: 0 } };
        default:
          return state;
      }
  }
};

export const Stopwatch = () => {
  const { state, send, matches } = useMachine(
    reducer,
    { name: "idle" } as const,
    {
      currentTime: 0,
    }
  );

  return (
    <div>
      <h1>Stopwatch</h1>
      <p>{state.ctx.currentTime.toFixed(2)}</p>
      {matches({
        idle: () => (
          <button onClick={() => send({ type: "start" })}>Start</button>
        ),
        running: () => (
          <div>
            <button onClick={() => send({ type: "pause" })}>Pause</button>
            <button onClick={() => send({ type: "reset" })}>Reset</button>
          </div>
        ),
        paused: () => (
          <div>
            <button onClick={() => send({ type: "start" })}>Resume</button>
            <button onClick={() => send({ type: "reset" })}>Reset</button>
          </div>
        ),
      })}
    </div>
  );
};
