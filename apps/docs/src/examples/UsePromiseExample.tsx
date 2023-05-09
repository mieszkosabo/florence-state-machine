import { useState } from "react";
import { usePromise } from "@florence-state-machine/use-promise";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";

const echo = (value: string): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });

export const UsePromiseExample = () => {
  const [text, setText] = useState("hello");
  const { state, matches, cancel, start } = usePromise(() => echo(text), {
    autoInvoke: true,
  });

  console.log("state: ", state);

  return (
    <div>
      <Heading mb={4}>usePromise</Heading>
      <Flex mb={4}>
        <Input
          mr={4}
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <Button w={40} onClick={start}>
          Load echo
        </Button>
      </Flex>
      {matches({
        pending: () => (
          <Flex align="center">
            <Text>pending...</Text>
            <Button variant="ghost" colorScheme="red" onClick={cancel}>
              cancel
            </Button>
          </Flex>
        ),
        rejected: ({ error }) => (
          <Text>
            error: <b>{error.message}</b>
          </Text>
        ),
        resolved: ({ value }) => (
          <Text>
            echo: <b>{value}</b>
          </Text>
        ),
      })}
    </div>
  );
};
