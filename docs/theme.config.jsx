import Image from "next/image";
import logoBlack from "./public/logo_black.png";
import logoWhite from "./public/logo_white.png";
import Logo from "./components/Logo";

export default {
  project: {
    link: "https://github.com/mieszkosabo/florence-state-machine",
  },
  logo: () => {
    return <Logo />;
  },
  primaryHue: { dark: 279.17, light: 279.17 },
};
