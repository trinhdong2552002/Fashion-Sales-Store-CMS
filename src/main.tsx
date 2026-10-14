import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { customTheme } from "./theme/index";
import { SnackbarProvider } from "./components/snackbar/index";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={customTheme}>
            <SnackbarProvider>
              <CssBaseline />
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
