import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // Set this to 'light'
  useSystemColorMode: false, // Ensure this is false to disable system preference
};

const theme = extendTheme({ config });

export default theme;
