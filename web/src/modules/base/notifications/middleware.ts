import { hideNotification } from "@root/modules/base/notifications/actions";
import {
    CLEAR_NOTIFICATIONS,
    HIDE_NOTIFICATION,
    SHOW_NOTIFICATION,
} from "@root/modules/base/notifications/actionTypes";
import { areThereNotifications } from "@root/modules/base/notifications/functions";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { IReduxState, IStore } from "@root/modules/base/redux/types";

/**
 * Map of timers.
 *
 * @type {Map}
 */
const timers = new Map();

/**
 * Function that creates a timeout id for specific notification.
 *
 * @param {Object} notification - Notification for which we want to create a timeout.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {void}
 */
const createTimeoutId = (notification: { timeout: number; uid: string }, dispatch: IStore["dispatch"]) => {
    const { timeout, uid } = notification;

    if (timeout) {
        const timerID = setTimeout(() => {
            dispatch(hideNotification(uid));
        }, timeout);

        timers.set(uid, timerID);
    }
};

/**
 * Returns notifications state.
 *
 * @param {Object} state - Global state.
 * @returns {Array<Object>} - Notifications state.
 */
const getNotifications = (state: IReduxState) => {
    const _visible = areThereNotifications(state);
    const { notifications } = state["modules/base/notifications"];

    return _visible ? notifications : [];
};

/**
 * Middleware that captures actions to display notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register((store) => (next) => (action) => {
    const { dispatch, getState } = store;
    const state = getState();

    switch (action.type) {
        case CLEAR_NOTIFICATIONS: {
            const _notifications = getNotifications(state);

            for (const notification of _notifications) {
                if (timers.has(notification.uid)) {
                    const timeout = timers.get(notification.uid);

                    clearTimeout(timeout);
                    timers.delete(notification.uid);
                }
            }
            timers.clear();
            break;
        }
        case SHOW_NOTIFICATION: {
            if (timers.has(action.uid)) {
                const timer = timers.get(action.uid);

                clearTimeout(timer);
                timers.delete(action.uid);
            }

            createTimeoutId(action, dispatch);
            break;
        }
        case HIDE_NOTIFICATION: {
            const timer = timers.get(action.uid);

            clearTimeout(timer);
            timers.delete(action.uid);
            break;
        }
    }

    return next(action);
});
