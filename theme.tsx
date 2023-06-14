import { extendTheme } from "@chakra-ui/react";
import { Button } from "./components/chakra/component-themes/button-theme";

const fonts = {
  mono: `'Gidole', sans-serif`,
  montserrat: `'Gidole', sans-serif`,
  body: `'Gidole', sans-serif`,
  heading: `'Gidole', sans-serif`,
};

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};

const theme = extendTheme({
  styles: {
    global: {
      a: {
        color: "#38475c",
      },
      h1: {
        fontSize: "34px",
        color: "#2276ac",
      },
    },
  },
  semanticTokens: {
    colors: {
      text: {
        default: "#38475c",
        _dark: "#ade3b8",
      },
    },
    radii: {
      button: "12px",
    },
  },
  colors: {
    black: "#16161D",
    primary: {
      50: "rgba(207, 63, 2, 0.3)",
      100: "#fbefea",
      200: "#f7e0d6",
      300: "#efc1ae",
      400: "#e0845d",
      500: "#CF3F02",
      600: "#ad3401",
      700: "#8c2a01",
      800: "#6b2001",
      900: "#4a1600",
    },
    secondary: "#2276ac",
    base: {
      50: "rgba(125, 121, 121, 0.08)",
      100: "rgba(125, 121, 121,0.16)",
      200: "rgba(125, 121, 121, 0.32)",
      300: "rgba(125, 121, 121, 0.64)",
      400: "rgba(125, 121, 121, 1)",
      500: "#443F3F",
      600: "rgba(50, 47, 47, 0.85)",
      700: "rgba(41, 38, 38, 1)",
      800: "rgba(32, 30, 30, 1)",
      900: "rgba(24, 23, 23, 1)",
    },
  },
  fonts,
  breakpoints,
  components: {
    Button,
  },
});

export default theme;
