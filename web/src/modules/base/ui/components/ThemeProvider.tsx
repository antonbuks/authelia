import * as React from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import BaseTheme from "@root/modules/base/ui/components/BaseTheme";

/**
 * The theme provider for the web app.
 *
 * @param {Object} props - The props of the component.
 * @returns {React.ReactNode}
 */
function ThemeProvider(props: React.PropsWithChildren) {
    return <MuiThemeProvider theme={BaseTheme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;
