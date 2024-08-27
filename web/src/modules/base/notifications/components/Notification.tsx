import { Fragment } from "react";

import useNotifier from "@root/modules/base/notifications/hooks/useNotifier";

/**
 * Implements a React {@link Component} to display a notifications from redux using notistack.
 *
 * @returns {ReactElement}
 */
export function Notification() {
    useNotifier();

    return <Fragment />;
}
