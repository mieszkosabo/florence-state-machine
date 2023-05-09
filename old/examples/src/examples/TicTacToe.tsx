import { Button, HStack, Heading, Text } from "@chakra-ui/react";
import { Reducer, createMachine, useMachine } from "florence-state-machine";
import { P, match } from "ts-pattern";

type Board = ("x" | "o" | " ")[][];

type State =
  | {
      name: "playing";
      board: Board;
      playerMakingMove: "x" | "o";
    }
  | {
      name: "gameOver";
      board: Board;
      winner: "x" | "o" | "draw";
    };

type Event =
  | {
      type: "MAKE_MOVE";
      payload: {
        row: number;
        col: number;
      };
    }
  | {
      type: "RESET";
    };

const evaluateBoard = (board: Board): "x" | "o" | "draw" | "playing" => {
  const linesToCheck = [
    // rows
    board[0],
    board[1],
    board[2],

    // columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],

    // diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of linesToCheck) {
    if (line.every((cell) => cell === "x")) {
      return "x";
    }

    if (line.every((cell) => cell === "o")) {
      return "o";
    }
  }

  if (board.some((row) => row.some((cell) => cell === " "))) {
    return "playing";
  }

  return "draw";
};

const reducer: Reducer<State, Event> = (state, event) =>
  match<[State, Event], ReturnType<Reducer<State, Event>>>([state, event])
    .with([P._, { type: "RESET" }], () => ({
      name: "playing",
      board: EMPTY_BOARD,
      playerMakingMove: "x",
    }))
    .with(
      [
        {
          name: "playing",
          board: P.select("board"),
          playerMakingMove: P.select("currentPlayer"),
        },
        { type: "MAKE_MOVE", payload: P.select("payload") },
      ],
      ({ currentPlayer, board, payload }) => {
        if (board[payload.row][payload.col] !== " ") {
          return state;
        }

        const newBoard: Board = board.map((row) => [...row]);

        newBoard[payload.row][payload.col] = currentPlayer;

        const result = evaluateBoard(newBoard);

        return match(result)
          .with(
            P.union("x", "o", "draw"),
            (winner) =>
              ({
                name: "gameOver",
                board: newBoard,
                winner,
              } as const)
          )
          .with(
            "playing",
            () =>
              ({
                name: "playing",
                board: newBoard,
                playerMakingMove: currentPlayer === "x" ? "o" : "x",
              } as const)
          )
          .exhaustive();
      }
    )
    .otherwise(() => state);

const EMPTY_BOARD: Board = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "],
];

const ticTacToeMachine = createMachine({
  reducer,
  initialState: {
    name: "playing",
    board: EMPTY_BOARD,
    playerMakingMove: "x",
  },
});

export const TicTacToe = () => {
  const { state, send, matches } = useMachine(ticTacToeMachine);

  return (
    <div>
      <Heading mb={4}>Tic Tac Toe</Heading>

      <Text fontSize={18} mb={4}>
        {matches({
          playing: ({ playerMakingMove }) => `${playerMakingMove}'s turn:`,
          gameOver: ({ winner }) =>
            winner === "draw" ? "It's a draw!" : `${winner} won!`,
        })}
        {state.name === "gameOver" && (
          <Button
            size="xs"
            colorScheme="teal"
            ml={2}
            onClick={() => send({ type: "RESET" })}
          >
            Reset
          </Button>
        )}
      </Text>

      {[0, 1, 2].map((row) => (
        <HStack m={2} key={row}>
          {[0, 1, 2].map((col) => (
            <Button
              key={`btn-${row}-${col}`}
              isDisabled={state.name === "gameOver"}
              onClick={() =>
                send({
                  type: "MAKE_MOVE",
                  payload: {
                    row,
                    col,
                  },
                })
              }
            >
              {state.board[row][col]}
            </Button>
          ))}
        </HStack>
      ))}
    </div>
  );
};
