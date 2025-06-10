import { extendTheme, textDecoration } from "@chakra-ui/react";
// Supports weights 100-900
import '@fontsource-variable/montserrat';
import '@fontsource/lato';

export const customTheme = extendTheme({
  colors: {
    primary: "#1a202c",
    secondary: "#354055",
    accent: "#484041",
    background: '#fafafa',
    bgSidebar: '#fafafa',
    botonBg: '#1a202c',
    botonColor: '#fafafa',
    link: "#1954EE",
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
        bg: "background"
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
      p:{
        color: "secondary"
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
          borderRadius: "50%",
          width: "15px",
          height: "15px",
        }
      },
    },
  },
});

export default customTheme;
