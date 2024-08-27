import { IReduxState } from "@root/modules/base/redux/types";
import { AuthenticationLevel } from "@services/State";

/**
 * Indicates if the toolbox is visible or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True to indicate that the toolbox is visible, false -
 * otherwise.
 */
export function isFirstFactorReady(state: IReduxState) {
    const { authenticationLevel } = state["modules/login"];

    return authenticationLevel === AuthenticationLevel.Unauthenticated;
}

/**
 * Indicates if the toolbox is visible or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True to indicate that the toolbox is visible, false -
 * otherwise.
 */
export function isSecondFactorReady(state: IReduxState) {
    const loginState = state["modules/login"];
    const config = state["modules/config"];
    const user = state["modules/user"];

    return loginState && config && user;
}
