import { createTheme } from "@mui/material";

export const customTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        // Style for the 'contained' variant
        contained: {
          textTransform: "none",
          color: "white",
          fontSize: "1rem",
        },
        // Style for the 'outlined' variant
        outlined: {
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
  },
});
