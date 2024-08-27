import { HIDE_NOTIFICATION, SHOW_NOTIFICATION } from "@root/modules/base/notifications/actionTypes";
import {
    NOTIFICATION_TIMEOUT,
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
} from "@root/modules/base/notifications/constants";
import { INotificationProps } from "@root/modules/base/notifications/types";
import { IStore } from "@root/modules/base/redux/types";

/**
 * Function that returns notification timeout value based on notification timeout type.
 *
 * @param {string} type - Notification type.
 * @param {Object} notificationTimeouts - Config notification timeouts.
 * @returns {number}
 */
function getNotificationTimeout(
    type?: string,
    notificationTimeouts?: {
        long?: number;
        medium?: number;
        short?: number;
    },
) {
    if (type === NOTIFICATION_TIMEOUT_TYPE.SHORT) {
        return notificationTimeouts?.short ?? NOTIFICATION_TIMEOUT.SHORT;
    } else if (type === NOTIFICATION_TIMEOUT_TYPE.MEDIUM) {
        return notificationTimeouts?.medium ?? NOTIFICATION_TIMEOUT.MEDIUM;
    } else if (type === NOTIFICATION_TIMEOUT_TYPE.LONG) {
        return notificationTimeouts?.long ?? NOTIFICATION_TIMEOUT.LONG;
    }

    return NOTIFICATION_TIMEOUT.STICKY;
}

/**
 * Queues a notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Timeout type.
 * @returns {Function}
 */
export function showNotification(props: INotificationProps = {}, type?: string) {
    return function (dispatch: IStore["dispatch"], getState: IStore["getState"]) {
        const { notifications, notificationTimeouts } = getState()["modules/config"];
        const { descriptionKey, titleKey } = props;

        const shouldDisplay =
            !notifications || notifications.includes(descriptionKey ?? "") || notifications.includes(titleKey ?? "");

        if (shouldDisplay) {
            return dispatch({
                type: SHOW_NOTIFICATION,
                props,
                timeout: getNotificationTimeout(type, notificationTimeouts),
                uid: props.uid || Date.now().toString(),
            });
        }
    };
}

/**
 * Queues an error notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export function showErrorNotification(props: INotificationProps, type?: string) {
    return showNotification(
        {
            ...props,
            appearance: NOTIFICATION_TYPE.ERROR,
        },
        type,
    );
}

/**
 * Removes the notification with the passed in id.
 *
 * @param {string} uid - The unique identifier for the notification to be
 * removed.
 * @returns {{
 *     type: HIDE_NOTIFICATION,
 *     uid: number
 * }}
 */
export function hideNotification(uid: string) {
    return {
        type: HIDE_NOTIFICATION,
        uid,
    };
}
