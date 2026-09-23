import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: "success" | "info" | "warning" | "error",
  ) => void;
}

// Create the context
const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // The 'value' is what we pass down to all components
  const value = { showSnackbar };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
