import { APP_WILL_MOUNT, APP_WILL_UNMOUNT, SET_LOCATION_URL } from "@root/modules/base/app/actionTypes";
import { set } from "@root/modules/base/redux/functions";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";

export interface IAppState {
    locationURL?: URL;
    app?: any;
}

ReducerRegistry.register<IAppState>("modules/app", (state = {}, action): IAppState => {
    switch (action.type) {
        case SET_LOCATION_URL:
            return _setLocationURL(state, action);

        case APP_WILL_MOUNT: {
            const { app } = action;

            if (state.app !== app) {
                return {
                    ...state,
                    app,
                };
            }
            break;
        }
        case APP_WILL_UNMOUNT:
            if (state.app === action.app) {
                return {
                    ...state,
                    app: undefined,
                };
            }
            break;
    }

    return state;
});

/**
 * Reduces a specific redux action {@link SET_LOCATION_URL} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @param {Action} action - The redux action {@code SET_LOCATION_URL} to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _setLocationURL(state: IAppState, { locationURL }: { locationURL?: URL }) {
    return set(state, "locationURL", locationURL);
}
