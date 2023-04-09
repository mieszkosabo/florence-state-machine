import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { hello } from "florence-state-machine";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <p>{hello()}</p>
      </div>
    </div>
  );
}

export default App;
