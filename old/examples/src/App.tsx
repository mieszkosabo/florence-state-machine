import {
  Flex,
  IconButton,
  Link,
  Spacer,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import LoginPage from "./examples/LoginPage";
import { UsePromiseExample } from "./examples/UsePromiseExample";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Stopwatch } from "./examples/Stopwatch";
import { TicTacToe } from "./examples/TicTacToe";

const EXAMPLES: Record<string, () => JSX.Element> = {
  "login-page": LoginPage,
  "use-promise": UsePromiseExample,
  stopwatch: Stopwatch,
  "tic-tac-toe": TicTacToe,
};

const useExample = () => {
  const exampleName = window.location.pathname.split("/")[1];

  return EXAMPLES[exampleName] ?? EXAMPLES["login-page"];
};

function App() {
  const Example = useExample();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex direction="column" w="full" h="100vh">
      <Flex
        py={2}
        px={4}
        mb={4}
        borderBottom={"solid 1px"}
        borderBottomColor="gray.400"
        align="center"
      >
        <Text fontWeight="bold" fontFamily="courier, monospace">
          florence-state-machine
        </Text>
        <Spacer />
        <IconButton
          mr={2}
          variant="ghost"
          aria-label="change color mode"
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />
        <Link href="https://github.com/mieszkosabo/florence-state-machine">
          Github
        </Link>
      </Flex>

      <Flex p={4}>
        <VStack h="full" w="200px" align="flex-start">
          <Text color="teal.500" fontWeight={500}>
            Examples
          </Text>
          {Object.keys(EXAMPLES).map((exampleKey) => (
            <Link key={exampleKey} href={"/" + exampleKey}>
              {exampleKey}
            </Link>
          ))}
        </VStack>
        <Flex w="full" h="full">
          <Example />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
