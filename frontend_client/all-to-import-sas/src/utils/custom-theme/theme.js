import { extendTheme, textDecoration } from "@chakra-ui/react";
import "@fontsource-variable/montserrat";
import "@fontsource/lato";

export const customTheme = extendTheme({
  colors: {
    primary: "#3a3a3a",
    secondary: "#fafafa",
    accent: "#484041",
    background: "#fafafa",
    bg_card: "#fefdff",
    background2: "rgb(51,51,51)",
    bg2: "#C9C5BA",
    link: "#1954EE",
    botonBg: "#3a3a3a",
    botonColor: "#fafafa",
  },
  fonts: {
    heading: `'Montserrat Variable', sans-serif`,
    body: `'Lato', sans-serif`,
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  styles: {
    global: {
      body: {
        fontFamily: "body",
        bg: "background",
      },
      h1: {
        fontFamily: "heading",
      },
      h2: {
        fontFamily: "heading",
      },
      h3: {
        fontFamily: "heading",
      },
      h4: {
        fontFamily: "heading",
      },
      h5: {
        fontFamily: "heading",
      },
      h6: {
        fontFamily: "heading",
      },
      a: {
        textDecoration: "underline",
      },
      fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },
    },
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: "50%", // Hace que el control del checkbox sea redondo
          width: "15px",
          height: "15px",
        },
      },
    },
    Button: {
      variants: {
        primary: {
          color: "botonColor",
          bg: "botonBg",
          border: "1px solid",
          borderColor: "transparent",
          _hover: {
            transition: "all .5s ease-out",
            border: "1px solid",
            borderColor: "botonBg",
            bg: "botonColor",
            color: "botonBg",
          },
        },
        quitarDelCarrito: {
          color: "#bf0603",
          bg: "",
          border: "1px solid",
          borderColor: "#bf0603",
          _hover: {
            transition: "all .5s ease-out",
            border: "1px solid",
            borderColor: "#bf0603",
            bg: "#bf0603",
            color: "botonColor",
          },
          // size: { base: "xs" },
        },
      },
    },
  },
});

export default customTheme;
