import { ComponentType } from "react";

import { toState } from "@root/modules/base/redux/functions";
import { IStateful } from "@root/modules/base/redux/types";

/**
 * Checks if any {@code Dialog} is currently open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export function isAnyDialogOpen(stateful: IStateful) {
    return Boolean(toState(stateful)["modules/base/dialog"].component);
}

/**
 * Checks if a {@code Dialog} with a specific {@code component} is currently
 * open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @param {React.Component} component - The {@code component} of a
 * {@code Dialog} to be checked.
 * @returns {boolean}
 */
export function isDialogOpen(stateful: IStateful, component: ComponentType<any>) {
    return toState(stateful)["modules/base/dialog"].component === component;
}
