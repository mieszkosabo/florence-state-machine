import { Button, HStack, Heading, Text } from "@chakra-ui/react";
import { Effect, Reducer, useMachine } from "florence-state-machine";
import { P, match } from "ts-pattern";

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

const reducer: Reducer<State, Event, Context> = (state, event) =>
  match<[State["name"], Event], ReturnType<Reducer<State, Event, Context>>>([
    state.name,
    event,
  ])
    .with([P.union("idle", "paused"), { type: "start" }], () => [
      { name: "running" },
      tick,
    ])
    .with([P.union("paused", "running"), { type: "reset" }], () => ({
      name: "idle",
      ctx: { currentTime: 0 },
    }))
    .with(["running", { type: "pause" }], () => ({ name: "paused" }))
    .with(["running", { type: "tick" }], () => [
      {
        name: "running",
        ctx: { currentTime: state.ctx.currentTime + 0.1 },
      },
      tick,
    ])
    .otherwise(() => state);

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
      <Heading mb={4}>Stopwatch</Heading>
      <Text
        fontWeight={600}
        fontSize={28}
        mb={4}
      >{`${state.ctx.currentTime.toFixed(1)} s.`}</Text>
      {matches({
        idle: () => (
          <Button colorScheme="teal" onClick={() => send({ type: "start" })}>
            Start
          </Button>
        ),
        running: () => (
          <HStack>
            <Button onClick={() => send({ type: "pause" })}>Pause</Button>
            <Button
              variant="ghost"
              colorScheme="red"
              onClick={() => send({ type: "reset" })}
            >
              Reset
            </Button>
          </HStack>
        ),
        paused: () => (
          <HStack>
            <Button colorScheme="teal" onClick={() => send({ type: "start" })}>
              Resume
            </Button>
            <Button onClick={() => send({ type: "reset" })}>Reset</Button>
          </HStack>
        ),
      })}
    </div>
  );
};
