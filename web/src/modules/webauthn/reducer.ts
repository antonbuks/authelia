import { WebAuthnTouchState } from "@models/WebAuthn";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import {
    REGISTER_WEBAUTHN,
    SIGN_IN_ERROR_WEBAUTHN,
    SIGN_IN_SUCCESS_WEBAUTHN,
    STATE_CHANGE_WEBAUTHN,
} from "@root/modules/webauthn/actionTypes";

const DEFAULT_STATE = {
    id: "webauthn-method",
    registered: false,
    state: WebAuthnTouchState.WaitTouch,
};

export interface IWebAuthnState {
    id: string;
    registered: boolean;
    error?: Error;
    state: WebAuthnTouchState;
}

ReducerRegistry.register<IWebAuthnState>("modules/webauthn", (state = DEFAULT_STATE, action): IWebAuthnState => {
    switch (action.type) {
        case STATE_CHANGE_WEBAUTHN:
            return {
                ...state,
                state: action.state,
            };

        case REGISTER_WEBAUTHN:
            return {
                ...state,
                id: action.id,
            };

        case SIGN_IN_ERROR_WEBAUTHN:
            return {
                ...state,
                id: "",
                registered: false,
                state: WebAuthnTouchState.Failure,
                error: action.error,
            };

        case SIGN_IN_SUCCESS_WEBAUTHN:
            return {
                ...state,
                state: WebAuthnTouchState.WaitTouch,
                registered: true,
            };
    }

    return state;
});
