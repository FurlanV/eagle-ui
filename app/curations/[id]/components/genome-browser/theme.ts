const theme = {
  palette: {
    primary: {
      main: "hsl(var(--primary))",
      // light: "hsl(var(--primary) / 0.8)",
      // dark: "hsl(var(--primary) / 1.2)",
      // contrastText: "hsl(var(--primary-foreground))",
    },
    secondary: {
      //main: "hsl(var(--primary-foreground))",
      main: "hsl(var(--background) / 0.75)",
      // light: "hsl(var(--secondary) / 0.8)",
      // dark: "hsl(var(--secondary) / 1.2)",
      // contrastText: "hsl(var(--secondary-foreground))",
    },
    tertiary: {
      main: "hsl(var(--background) / 0.75)",
    },
    quaternary: {
      main: "#d50000",
    },
    background: {
      //default: "hsl(var(--foreground))",
      //paper: "hsl(var(--card))",
    },
    text: {
      main: "hsl(var(--foreground))",
      // secondary: "hsl(var(--muted-foreground))",
    },
    divider: "hsl(var(--muted-foreground) / 0.75)",
    // bases: {
    //   A: { main: "hsl(var(--chart-1))" },
    //   C: { main: "hsl(var(--chart-2))" },
    //   G: { main: "hsl(var(--chart-3))" },
    //   T: { main: "hsl(var(--chart-4))" },
    //   N: { main: "hsl(var(--chart-5))" },
    // },
  },
  tracks: {
    color: "hsl(var(--foreground))",
    background: "hsl(var(--background))",
    labelColor: "hsl(var(--foreground))",
    labelBackground: "hsl(var(--card))",
  },
}

export default theme
