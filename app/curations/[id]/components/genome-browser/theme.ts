const getTheme = (isDarkMode: boolean) => {
  return {
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "hsl(var(--primary))",
      },
      secondary: {
        main: "hsl(var(--background))",
      },
      tertiary: {
        main: "hsl(7, 0%, 60%)",
      },
      text: {
        main: "#fffff",
      },
      divider: "hsl(var(--muted-foreground) / 0.75)",
    },
  }
}

export default getTheme
