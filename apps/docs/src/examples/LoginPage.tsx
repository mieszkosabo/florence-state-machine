import { createMachine, useMachine } from "@florence-state-machine/core";
import type { Reducer } from "@florence-state-machine/core";
import { sleep } from "../utils/sleep";
import { P, match } from "ts-pattern";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";

export type Event =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "logout" }
  | { type: "loginSuccess" }
  | { type: "loginError"; payload: { message: string } };

export type State =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "success" };

export type Context = {
  username: string;
};

const requestLogin = async (username: string): Promise<Event> => {
  await sleep(1000);
  if (username === "admin") {
    return { type: "loginSuccess" };
  }
  return {
    type: "loginError",
    payload: { message: "Invalid username" },
  };
};

export const reducer: Reducer<State, Event, Context> = (state, event) => {
  switch (state.name) {
    case "idle": {
      switch (event.type) {
        case "inputChange":
          return {
            name: "idle",
            ctx: {
              username: event.payload,
            },
          };
        case "loginRequest":
          return [
            {
              name: "loading",
            },
            () => requestLogin(state.ctx.username),
          ];
        default:
          return state;
      }
    }
    case "loading": {
      switch (event.type) {
        case "loginSuccess":
          return {
            name: "success",
            ctx: {
              username: "",
            },
          };
        case "loginError":
          return {
            name: "error",
            message: event.payload.message,
          };
        default:
          return state;
      }
    }
    case "error": {
      switch (event.type) {
        case "inputChange": {
          return {
            name: "idle",
            ctx: {
              username: event.payload,
            },
          };
        }
        default:
          return state;
      }
    }
    case "success": {
      switch (event.type) {
        case "logout":
          return { name: "idle" };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const loginMachine = createMachine({ reducer, initialState: { name: "idle" } });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reducerWithTsPattern: Reducer<State, Event, Context> = (state, event) =>
  // with ts-pattern we can match simultaneously on state.name and event.type!
  match<[State["name"], Event], ReturnType<Reducer<State, Event, Context>>>([
    state.name,
    event,
  ])
    .with(
      // in both idle and error state, we want to handle inputChange in the same way
      [P.union("idle", "error"), { type: "inputChange", payload: P.select() }],
      (username) => ({
        name: "idle",
        ctx: {
          username: username,
        },
      })
    )
    // only in idle state we want to handle loginRequest
    .with(["idle", { type: "loginRequest" }], () => [
      {
        name: "loading",
      },
      () => requestLogin(state.ctx.username),
    ])
    // below, two possible events that can happen in loading state
    .with(["loading", { type: "loginSuccess" }], () => ({
      name: "success",
      ctx: {
        username: "",
      },
    }))
    .with(
      ["loading", { type: "loginError", payload: P.select() }],
      (error) => ({
        name: "error",
        message: error.message,
      })
    )
    // nice and simple case for logout event -> only possible in success state
    .with(["success", { type: "logout" }], () => ({ name: "idle" }))
    // a single, global "default" case for all other combinations of states and events that we don't care about!
    .otherwise(() => state);

function LoginPage() {
  const { state, send, matches } = useMachine(loginMachine);

  if (state.name === "success") {
    return (
      <div>
        <Heading mb={4}>Login success</Heading>
        <Text mb={4} color="gray.500">
          You have successfully logged in!
        </Text>
        <Button onClick={() => send({ type: "logout" })}>Log out</Button>
      </div>
    );
  }

  return (
    <div>
      <Heading mb={8}>Login page</Heading>
      <Flex direction="column" maxW="320px" gap="16px">
        <form onSubmit={() => send({ type: "loginRequest" })}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              mb={2}
              type="text"
              disabled={state.name === "loading"}
              isInvalid={state.name === "error"}
              onChange={(e) =>
                send({ type: "inputChange", payload: e.target.value })
              }
            />
            <Flex w="full" justify="flex-end">
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={state.name === "loading"}
                loadingText={"Loading..."}
                isDisabled={state.name === "error" || state.name === "loading"}
                onClick={() => send({ type: "loginRequest" })}
              >
                {matches({
                  idle: () => "Log in",
                  error: () => "Log in",
                })}
              </Button>
            </Flex>
          </FormControl>
          {matches({
            error: ({ message }) => <Text color="red.600">{message}</Text>,
          })}
        </form>
      </Flex>
    </div>
  );
}

export default LoginPage;
