import { toState } from "@root/modules/base/redux/functions";
import { IStateful } from "@root/modules/base/redux/types";

/**
 * Tells whether or not the notifications are enabled and if there are any
 * notifications to be displayed based on the current Redux state.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export function areThereNotifications(stateful: IStateful) {
    const state = toState(stateful);
    const { enabled, notifications } = state["modules/base/notifications"];

    return enabled && notifications.length > 0;
}
