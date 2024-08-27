import { SecondFactorMethod } from "@models/Methods";
import {
    PASSWORD_CHANGED,
    REMEMBER_ME_CHANGED,
    SET_METHOD,
    SET_METHOD_SELECTION_OPEN,
    SET_WEBAUTHN_SUPPORTED,
    USERNAME_CHANGED,
} from "@root/modules/auth/actionTypes";
import PersistenceRegistry from "@root/modules/base/redux/PersistenceRegistry";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";

PersistenceRegistry.register("modules/auth", true, {
    preferredMethod: undefined,
});

const DEFAULT_STATE = {
    disabled: false,
    rememberMe: false,
    username: "",
    password: "",
    usernameError: false,
    passwordError: false,
    passwordCapsLock: false,
    passwordCapsLockPartial: false,
    methodSelectionOpen: false,
    webAuthnSupported: false,
    preferredMethod: undefined,
};

export interface IAuthState {
    disabled: boolean;
    rememberMe: boolean;
    username: string;
    password: string;
    usernameError: boolean;
    passwordError: boolean;
    passwordCapsLock: boolean;
    passwordCapsLockPartial: boolean;
    methodSelectionOpen: boolean;
    webAuthnSupported: boolean;
    preferredMethod?: SecondFactorMethod;
}

ReducerRegistry.register<IAuthState>("modules/auth", (state = DEFAULT_STATE, action): IAuthState => {
    switch (action.type) {
        case USERNAME_CHANGED:
            return {
                ...state,
                username: action.value,
                usernameError: false, // Reset error when username changes
            };
        case PASSWORD_CHANGED:
            return {
                ...state,
                password: action.value,
                passwordError: false, // Reset error when password changes
            };
        case REMEMBER_ME_CHANGED:
            return {
                ...state,
                rememberMe: !state.rememberMe,
            };
        case SET_METHOD_SELECTION_OPEN:
            return {
                ...state,
                methodSelectionOpen: action.payload,
            };
        case SET_WEBAUTHN_SUPPORTED:
            return {
                ...state,
                webAuthnSupported: action.payload,
            };
        case SET_METHOD:
            return {
                ...state,
                preferredMethod: action.method,
            };
    }

    return state;
});
