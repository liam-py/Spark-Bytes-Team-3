import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3C93A5",
      light: "#CDFFFF",
      dark: "#2B7280",
      contrastText: "#FFFFFF"

    },
    secondary: {
      main: "#CDFFFF",
      light: "#FFFFFF",
      dark: "#2B7280",
      contrastText: "#3C93A5"
    },
    background: {
      default: "#D9D9D9",
      paper: "#FFFFFF"
    },
    text: {
      //primary is white, secondary is black
      primary: "#FFFFFF",
      secondary: "#3C93A5"
    }
  },
  typography: {
    fontFamily: "Helvetica Neue , Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700
    
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400
    }
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            backgroundColor: "primary.dark",
            color: "primary.contrastText"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "background.paper",
          color: "text.secondary", 
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }
        },
      }
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: "200px",
          width: "100%",
          objectFit: "cover",
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px",
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        }
      }
    }
  }
});
export default theme;
