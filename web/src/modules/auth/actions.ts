import { SecondFactorMethod } from "@models/Methods";
import {
    PASSWORD_CHANGED,
    REMEMBER_ME_CHANGED,
    SET_METHOD,
    SET_METHOD_SELECTION_OPEN,
    SET_WEBAUTHN_SUPPORTED,
    SIGN_IN,
    USERNAME_CHANGED,
} from "@root/modules/auth/actionTypes";

/**
 * Action used to sign in.
 *
 * @param {string} username - Username to use for sign in.
 * @param {string} password - Password to use for sign in.
 * @param {boolean} rememberMe - Whether remember me is checked.
 * @returns {Object}
 */
export function signIn(username: string, password: string, rememberMe: boolean) {
    return {
        type: SIGN_IN,
        username,
        password,
        rememberMe,
    };
}

/**
 * Action used to control the username input.
 *
 * @param {string} username - Username value.
 * @returns {Object}
 */
export const usernameChanged = (username: string) => ({
    type: USERNAME_CHANGED,
    value: username,
});

/**
 * Action used to control the password input.
 *
 * @param {string} password - Password value.
 * @returns {Object}
 */
export const passwordChanged = (password: string) => ({
    type: PASSWORD_CHANGED,
    value: password,
});

/**
 * Action used to control the remember me checkbox.
 *
 * @returns {Object}
 */
export const rememberMeChanged = () => ({
    type: REMEMBER_ME_CHANGED,
});

/**
 * Action used to manage method selection dialog state.
 *
 * @param {boolean} isOpen - Whether dialog is open.
 * @returns {Object}
 */
export const setMethodSelectionOpen = (isOpen: boolean) => ({
    type: SET_METHOD_SELECTION_OPEN,
    payload: isOpen,
});

/**
 * Action used to manage webauthn support.
 *
 * @param {boolean} isOpen - Whether dialog is open.
 * @returns {Object}
 */
export const setWebAuthnSupported = (isSupported: boolean) => ({
    type: SET_WEBAUTHN_SUPPORTED,
    payload: isSupported,
});

/**
 * Action used to handle method select.
 *
 * @param {boolean} isOpen - Whether dialog is open.
 * @returns {Object}
 */
export const handleMethodSelected = (method: SecondFactorMethod) => ({
    type: SET_METHOD,
    method,
});
