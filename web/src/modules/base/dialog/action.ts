import { ComponentType } from "react";

import { HIDE_DIALOG, OPEN_DIALOG } from "@root/modules/base/dialog/actionTypes";

/**
 * Signals Dialog to close its dialog.
 *
 * @param {Object} [component] - The {@code Dialog} component to close/hide. If
 * {@code undefined}, closes/hides {@code Dialog} regardless of which
 * component it's rendering; otherwise, closes/hides {@code Dialog} only if
 * it's rendering the specified {@code component}.
 * @returns {{
 *     type: HIDE_DIALOG,
 *     component: (React.Component | undefined)
 * }}
 */
export function hideDialog(component?: ComponentType<any>) {
    return {
        type: HIDE_DIALOG,
        component,
    };
}

/**
 * Signals Dialog to open dialog.
 *
 * @param {Object} component - The component to display as dialog.
 * @param {Object} [componentProps] - The React {@code Component} props of the
 * specified {@code component}.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: React.Component,
 *     componentProps: (Object | undefined)
 * }}
 */
export function openDialog(component: ComponentType<any>, componentProps?: Object) {
    return {
        type: OPEN_DIALOG,
        component,
        componentProps,
    };
}
