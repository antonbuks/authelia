import React from "react";

import { Theme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

import BaseApp from "@root/modules/base/app/components/BaseApp";
import DialogContainer from "@root/modules/base/dialog/components/DialogContainer";
import { Notification } from "@root/modules/base/notifications/components/Notification";
import ThemeProvider from "@root/modules/base/ui/components/ThemeProvider";

// Register middlewares and reducers.
import "@root/modules/base/redux/middlewares";
import "@root/modules/base/redux/reducers";

export interface IProps {
    /**
     * The URL, if any, with which the app was launched.
     */
    url: Object | string;
}

/**
 * Root app {@code Component} on Web/React.
 *
 * @augments AbstractApp
 */
export class App<P extends IProps = IProps> extends BaseApp<P> {
    /**
     * Renders the {@code Notification} in a notistack {@code SnackbarProvider}
     *
     * @param {Object} props - The properties to be passed to
     * the {@code NotificationsContainer}.
     */
    _createNotificationsElement(props?: any) {
        return <SnackbarProvider maxSnack={5}>{React.createElement(Notification, props)}</SnackbarProvider>;
    }

    /**
     * Renders the platform specific dialog container.
     */
    _renderDialogContainer() {
        return (
            <ThemeProvider>
                <DialogContainer />
            </ThemeProvider>
        );
    }

    /**
     * Overrides the parent method to inject style provider
     *
     * @override
     */
    _createMainElement(component: React.ComponentType, props: { _theme: Theme }) {
        return <ThemeProvider>{super._createMainElement(component, props)}</ThemeProvider>;
    }
}
