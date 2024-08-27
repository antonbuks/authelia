import { ComponentType } from "react";

import { HIDE_DIALOG, OPEN_DIALOG } from "@root/modules/base/dialog/actionTypes";
import { assign } from "@root/modules/base/redux/functions";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";

export interface IDialogState {
    component?: ComponentType;
    componentProps?: Object;
    sheet?: ComponentType;
    sheetProps?: Object;
}

/**
 * Reduces redux actions which show or hide dialogs.
 *
 * @param {IDialogState} state - The current redux state.
 * @param {Action} action - The redux action to reduce.
 * @param {string} action.type - The type of the redux action to reduce..
 * @returns {State} The next redux state that is the result of reducing the
 * specified action.
 */
ReducerRegistry.register<IDialogState>("modules/base/dialog", (state = {}, action): IDialogState => {
    switch (action.type) {
        case HIDE_DIALOG: {
            const { component } = action;

            if (typeof component === "undefined" || state.component === component) {
                return assign(state, {
                    component: undefined,
                    componentProps: undefined,
                });
            }
            break;
        }

        case OPEN_DIALOG:
            return assign(state, {
                component: action.component,
                componentProps: action.componentProps,
            });
    }
    return state;
});
