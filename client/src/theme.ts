import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3C93A5",
      light: "#CDFFFF",
      dark: "#2B7280",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#CDFFFF",
      light: "#FFFFFF",
      dark: "#2B7280",
      contrastText: "#3C93A5",
    },
    background: {
      default: "#F8FAFB",
      paper: "#FFFFFF",
    },
    text: {
      //primary is white, secondary is black
      primary: "#1a1a1a",
      secondary: "#3C93A5",
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400, 
      letterSpacing: "-0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      letterSpacing: "-0.01em",
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(60, 147, 165, 0.08)',
    '0 4px 6px rgba(60, 147, 165, 0.1)',
    '0 8px 12px rgba(60, 147, 165, 0.12)',
    '0 12px 20px rgba(60, 147, 165, 0.15)',
    '0 16px 28px rgba(60, 147, 165, 0.18)',
    ...Array(19).fill('none'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
<<<<<<< HEAD
=======
          textTransform: "none",
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          borderRadius: 10,
          padding: "12px 28px",
          fontSize: "0.9375rem",
          fontWeight: 500,
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(60, 147, 165, 0.2)",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #3C93A5 0%, #2B7280 100%)",
          color: "#FFFFFF",
          "&:hover": {
            background: "linear-gradient(135deg, #2B7280 0%, #1F5A66 100%)",
          },
        },
        outlined: {
          borderColor: "#3C93A5",
          color: "#3C93A5",
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: "rgba(60, 147, 165, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(60, 147, 165, 0.08)",
          border: "1px solid rgba(60, 147, 165, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(60, 147, 165, 0.15)",
            transform: "translateY(-4px)"
          }
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: "200px",
          width: "100%",
          objectFit: "cover",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "rgba(60, 147, 165, 0.2)",
              borderWidth: 2
            },
            "&:hover fieldset": {
              borderColor: "#3C93A5"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3C93A5",
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(60, 147, 165, 0.08)",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid rgba(60, 147, 165, 0.1)"
        }
      }
    }, 
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        },
        filled: {
          backgroundColor: "rgba(205, 255, 255, 0.3)",
          color: "#2B7280",
          border: "1px solid rgba(60, 147, 165, 0.2)"
        }
      }
    }
  },
});
export default theme;
