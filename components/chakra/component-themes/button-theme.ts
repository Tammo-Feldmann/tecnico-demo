import type { ComponentStyleConfig } from "@chakra-ui/theme";

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
export const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: `0px 4px 4px 0px rgba(68, 63, 63, 0.08), 0px 0px 4px 0px rgba(68, 63, 63, 0.08)`,
    borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "12",
      fontWeight: "400",
      px: 4,
      py: 3,
    },
    md: {
      fontSize: "md",
      px: 6,
      py: 4,
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      margin: 0,
    },
    solid: {
      bg: "primary.500",
      color: "white",
    },
    link: {
      textTransform: "unset",
      boxShadow: "unset",
      bg: "none",
      color: "base",
      p: 0,
      m: 0,
    },
    empty: {
      textTransform: "unset",
      boxShadow: "unset",
      bg: "none",
      color: "base",
      p: 0,
      m: 0,
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};
