import { AnyAction } from "redux";

import { appWillNavigate } from "@root/modules/base/app/actions";
import { SET_LOCATION_URL } from "@root/modules/base/app/actionTypes";
import { _getRouteToRender } from "@root/modules/base/app/functions";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { IStore } from "@root/modules/base/redux/types";

MiddlewareRegistry.register((store) => (next) => (action) => {
    switch (action.type) {
        case SET_LOCATION_URL: {
            _setUrl(store, next, action);

            break;
        }
    }
});

/**
 * Notifies the feature app that the action {@link SET_ROOM} is being dispatched
 * within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action, {@code SET_LOCATION_URL}, which is being
 * dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setUrl(store: IStore, next: Function, action: AnyAction) {
    const result = next(action);

    _navigate(store);

    return result;
}

/**
 * Navigates to a route in accord with a specific redux state.
 *
 * @param {Store} store - The redux store which determines/identifies the route
 * to navigate to.
 * @private
 * @returns {void}
 */
function _navigate({ dispatch, getState }: IStore) {
    const state = getState();
    const { app } = state["modules/app"];

    _getRouteToRender(state).then((route: Object) => {
        dispatch(appWillNavigate(app, route));

        return app._navigate(route);
    });
}
