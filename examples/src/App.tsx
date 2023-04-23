import { Flex, Link, Spacer, Text, VStack } from "@chakra-ui/react";
import LoginPage from "./examples/LoginPage";
import { UsePromiseExample } from "./examples/UsePromiseExample";

const EXAMPLES: Record<string, () => JSX.Element> = {
  "login-page": LoginPage,
  "use-promise": UsePromiseExample,
};

const useExample = () => {
  const exampleName = window.location.pathname.split("/")[1];

  return EXAMPLES[exampleName] ?? EXAMPLES["login-page"];
};

function App() {
  const Example = useExample();

  return (
    <Flex direction="column" w="full" h="100vh" p={4}>
      <Flex mb={4} borderBottom={"solid 1px"} borderBottomColor="gray.400">
        <Text>florence-state-machine</Text>
        <Spacer />
        <Link href="https://github.com/mieszkosabo/florence-state-machine">
          Github
        </Link>
      </Flex>
      <Flex>
        <VStack h="full" w="200px" align="flex-start">
          <Text color="teal.500" fontWeight={500}>
            Examples
          </Text>
          <Link href="/login-page">login-page</Link>
          <Link href="/use-promise">use-promise</Link>
        </VStack>
        <Flex w="full" h="full">
          <Example />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
