import {
    APP_WILL_MOUNT,
    APP_WILL_NAVIGATE,
    APP_WILL_UNMOUNT,
    SET_LOCATION_URL,
} from "@root/modules/base/app/actionTypes";
import { IStore } from "@root/modules/base/redux/types";
import { _parseURIString } from "./functions";

/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export function appWillMount(app: Object) {
    return {
        type: APP_WILL_MOUNT,
        app,
    };
}

/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export function appWillUnmount(app: Object) {
    return {
        type: APP_WILL_UNMOUNT,
        app,
    };
}

/**
 * Sets the location URL of the application, connection, conference, etc.
 *
 * @param {URL} [locationURL] - The location URL of the application,
 * connection, conference, etc.
 * @returns {{
 *     type: SET_LOCATION_URL,
 *     locationURL: URL
 * }}
 */
export function setLocationURL(locationURL?: URL) {
    return {
        type: SET_LOCATION_URL,
        locationURL,
    };
}

/**
 * Triggers an in-app navigation to a specific route.
 *
 * @param {string|undefined} uri - The URI to which to navigate. It may be a
 * full URL with an HTTP(S) scheme, a full or partial URI with the app-specific
 * scheme
 * @returns {Function}
 */
export function appNavigate(uri: string) {
    return async (dispatch: IStore["dispatch"]) => {
        let location = _parseURIString(uri);

        // If the specified location (URI) does not identify a host, use the app's
        // default.
        if (!location?.host) {
            const defaultLocation = window.location;

            if (location) {
                location.host = defaultLocation.host;
                location.pathname = defaultLocation.pathname + location.pathname.substr(1);

                location.protocol = defaultLocation.protocol;
            } else {
                location = defaultLocation;
            }
        }

        location.protocol || (location.protocol = "https:");

        const locationURL = new URL(location.toString());

        dispatch(setLocationURL(locationURL));
    };
}

/**
 * Signals that a specific App will navigate (in the terms of React).
 *
 * @param {App} app - The App which will navigate.
 * @param {Object} route - The route which will be used.
 * @returns {{
 *     type: APP_WILL_NAVIGATE,
 *     app: App,
 *     route: Object
 * }}
 */
export function appWillNavigate(app: Object, route: Object) {
    return {
        type: APP_WILL_NAVIGATE,
        app,
        route,
    };
}
