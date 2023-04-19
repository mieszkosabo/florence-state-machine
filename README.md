<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Created from [this template](https://github.com/othneildrew/Best-README-Template)
-->

<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/mieszkosabo/florence-state-machine">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">florence-state-machine</h3>

  <p align="center">
    An ergonomic library for using type-safe state machines in React.
    <br />
    <!-- <a href="https://github.com/mieszkosabo/florence-state-machine"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
    <!-- <a href="https://github.com/mieszkosabo/florence-state-machine">View Demo</a> -->
    <!-- · -->
    <a href="https://github.com/mieszkosabo/florence-state-machine/issues">Report Bug</a>
    ·
    <a href="https://github.com/mieszkosabo/florence-state-machine/issues/new">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <!-- <li><a href="#roadmap">Roadmap</a></li> -->
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

This library was designed to be a sweet spot between sophisticated, and sometimes even overwhelming solutions such as [XState](https://xstate.js.org/docs/) and a often too simplistic React's `useReducer`.

Florence state machine is not a global state manager, but a lightweight tool to handle complex UI logic on more local level, such as in a single component.

<!-- Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `mieszkosabo`, `florence-state-machine`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description` -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Installation

- npm

```sh
npm i florence-state-machine
```

- yarn

```sh
yarn add florence-state-machine
```

- pnpm

```sh
pnpm add florence-state-machine
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Basic Usage

Let's say that we want to implement a login screen, where user can login with an username.

### Actions/Events

We start with defining all events (or "actions") that can happen in our _"system"_:

```ts
export type Action =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "loginSuccess" }
  | { type: "loginError"; payload: { message: string } };
```

This union type contains information about everything that can happen at some point. The first two actions come from the user and the last two
will come from the auth server. However, it doesn't matter from where the actions come to our state machine, so we don't include any information about it.

### States

Next, we'll define all possible states in which our system can be in. When defining a state machine for UI this step is
oftentimes surprisingly easy, since all states usually differ from each other visually, so it's not abstract. In our case:

```ts
export type State =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "success" };
```

We are missing the info about the state of the current value of the user input though. We could put it into the `idle` state, however that would introduce at least two problems:

1. We would probably have to put it into `idle`, `loading` and `error` states and handle passing it between them, so that the input doesn't reset its value between state changes.
2. We would change state on every keystroke and that's not really semantically intuitive, since the state is `editing email form` (or `idle`) the whole time. But _something_ changes, so what is it? The answer is _context_.

### Context

In `florence-state-machine` context is a mechanism that allows us to share some mutable data between all states:

```ts
export type Context = {
  username: string;
};
```

### Effects

Effects are async functions that return an action. Their signature is `() => Promise<Action>`. They are used to describe any async operations
that can happen in our system. In our case we will need to make a request to the auth server, so we will define an effect for that:

```ts
export const loginEffect = async (username: string): Promise<Action> => {
  try {
    await login(username);
    return { type: "loginSuccess" };
  } catch (error) {
    return { type: "loginError", payload: { message: error.message } };
  }
};
```

where `login` is some function that makes a request to the auth server.

### Transitions

Now, having defined all of the little pieces above, let's define how they all relate to each other.
We'll do that by defining a "spicy" version of a reducer function. A regular reducer (eg. used by `useReducer` hook or in Redux) is
a function that takes a state and an action and returns a new state. Its signature is `(state: State, action: Action) => State`.
A reducer in `florence-state-machine` is slightly more powerful, its signature is

```ts
(
  state: State & { ctx: Context },
  action: Action
) =>
  | State
  | (State & { ctx: Context })
  | [State, Effect<Action>]
  | [State & { ctx: Context }, Effect<Action>];

```

It takes a state (but with context!), an action and returns either

- a new state (this case is the same as in a regular reducer)
- a new state with updated context
- A tuple with a new state and a "declaration" of an effect that should be executed.
- The same as above, but with updated context.

Let's write a reducer for our login screen:

```ts
import type { Reducer } from "florence-state-machine";

export const reducer: Reducer<State, Action, Context> = (state, action) => {
  switch (state.name) {
    case "idle": {
      switch (action.type) {
        case "inputChange":
          return {
            name: "idle",
            ctx: {
              username: action.payload,
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
    case "loading":
      switch (action.type) {
        case "loginSuccess":
          return {
            name: "success",
          };
        case "loginError":
          return {
            name: "error",
            message: action.payload.message,
          };
        default:
          return state;
      }
    default:
      return state;
  }
};
```

By typing the reducer with a `Reducer` type from `florence-state-machine` we get type-safety and a nice autocomplete
throughout writing this function.

### Using the machine

First of all, notice how we described our whole system in this nice, readable way without even using this library! That was one
of the design goals of `florence-state-machine`: You don't have to learn any new syntax to use it, it's just TypeScript.

So what exactly does this library do? You can think of it as an execution engine for your actions. In case of simple actions it just
updates the state based on your reducer, however in case of effects it will execute them and, if the state didn't change in the meantime,
it will send the outputted action to the machine.

Now, let's use it in a React component:

```tsx
export function LoginPage() {
  const { state, send } = useMachine(reducer, { name: "idle" });

  switch (state.name) {
    case "idle":
      return (
        <div>
          <input
            type="text"
            onChange={(e) =>
              send({ type: "inputChange", payload: e.target.value })
            }
          />
          <button onClick={() => send({ type: "loginRequest" })}>login</button>
        </div>
      );
    case "loading":
      return <div>loading...</div>;
    case "error":
      return (
        <div>
          <p>error!</p>
          <p>{state.message}</p>
        </div>
      );
    case "success":
      return (
        <div>
          <p>success!</p>
        </div>
      );
  }
}
```

These are the basics of `florence-state-machine`. You can find more examples in the `examples` directory.

<!-- _For more examples, please refer to the [Documentation](https://example.com)_ -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
<!--
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
  - [ ] Nested Feature

See the [open issues](https://github.com/mieszkosabo/florence-state-machine/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/mieszkosabo/florence-state-machine.svg?style=for-the-badge
[contributors-url]: https://github.com/mieszkosabo/florence-state-machine/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mieszkosabo/florence-state-machine.svg?style=for-the-badge
[forks-url]: https://github.com/mieszkosabo/florence-state-machine/network/members
[stars-shield]: https://img.shields.io/github/stars/mieszkosabo/florence-state-machine.svg?style=for-the-badge
[stars-url]: https://github.com/mieszkosabo/florence-state-machine/stargazers
[issues-shield]: https://img.shields.io/github/issues/mieszkosabo/florence-state-machine.svg?style=for-the-badge
[issues-url]: https://github.com/mieszkosabo/florence-state-machine/issues
