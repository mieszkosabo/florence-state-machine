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

## Usage

Let's say that we want to implement a login screen, where user can login with an email.

We start with defining all events (or "actions") that can happen in our *"system"*:

```ts
export type Action =
  | { type: "inputChange"; payload: string }
  | { type: "loginRequest" }
  | { type: "loginSuccess" }
  | { type: "loginError"; payload: { message: string } };
```
This union type contains information about everything that can happen at some point. The first two actions come from the user and the last two
will come from the auth server. However, it doesn't matter from where the actions come to our state machine, so we don't include any information about it.

Next, we'll define all possible states in which our system can be in. When defining a state machine for UI this step is suprisingly easy, since
all states usually differ from each other visually, so it's not abstract. In our case:

```ts
export type State =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "success" };
```
We are missing the info about the state of the user input though. We could put it into the `idle` state, however that would introduce at least two problems:
1. We would probably have to put it and pass between `loading` and `error` states, so that the input doesn't lose its value between state changes.
2. We would change state on every keystroke and that's not really semanticaly intuitive, since the state is `editing email form` (or `idle`) the whole time. But *something* changes, so what is it? The answer is *context*.

In `florence-state-machine` context is a mechanism that allows us to share some mutable data between all states:

```ts
export type Context = {
  username: string;
};
```

Another example of a situation where context could be handy is imagine we're writting a stopwatch that has states such as `countdown` and `paused`. Both
of theses states should have access to the `currentTime` and that value should be decreased after every second when in the `countdown` state.




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
