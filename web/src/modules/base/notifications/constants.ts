/**
 * The standard time when auto-disappearing notifications should disappear.
 */
export const NOTIFICATION_TIMEOUT = {
    SHORT: 2500,
    MEDIUM: 5000,
    LONG: 10000,
    STICKY: false,
};

/**
 * Notification timeout type.
 */
export enum NOTIFICATION_TIMEOUT_TYPE {
    LONG = "long",
    MEDIUM = "medium",
    SHORT = "short",
    STICKY = "sticky",
}

/**
 * The set of possible notification types.
 *
 * @enum {string}
 */
export const NOTIFICATION_TYPE = {
    ERROR: "error",
    NORMAL: "normal",
    SUCCESS: "success",
    WARNING: "warning",
};

/**
 * A mapping of notification type to priority of display.
 *
 * @enum {number}
 */
export const NOTIFICATION_TYPE_PRIORITIES = {
    [NOTIFICATION_TYPE.ERROR]: 5,
    [NOTIFICATION_TYPE.NORMAL]: 3,
    [NOTIFICATION_TYPE.SUCCESS]: 3,
    [NOTIFICATION_TYPE.WARNING]: 4,
};

/**
 * The set of possible notification icons.
 *
 * @enum {string}
 */
export const NOTIFICATION_ICON = {
    ...NOTIFICATION_TYPE,
    MESSAGE: "message",
    PARTICIPANT: "participant",
    PARTICIPANTS: "participants",
};
