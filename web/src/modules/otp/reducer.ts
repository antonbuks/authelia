import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import {
    PASSCODE_CHANGED,
    REGISTER_OTP,
    RESPONSE_RECEIVED,
    SIGN_IN_ERROR_OTP,
    SIGN_IN_SUCCESS_OTP,
    STATE_CHANGE_OTP,
} from "@root/modules/otp/actionTypes";

export enum State {
    Idle = 1,
    InProgress = 2,
    Success = 3,
    Failure = 4,
}

const DEFAULT_STATE = {
    id: "one-time-password-method",
    registered: false,
    state: 1,
};

export interface IOTPState {
    id: string;
    registered: boolean;
    error?: Error;
    state: State;
    passcode?: string;
    resp?: any;
}

ReducerRegistry.register<IOTPState>("modules/otp", (state = DEFAULT_STATE, action): IOTPState => {
    switch (action.type) {
        case STATE_CHANGE_OTP:
            return {
                ...state,
                state: action.state,
            };

        case REGISTER_OTP:
            return {
                ...state,
                id: action.id,
            };

        case SIGN_IN_ERROR_OTP:
            return {
                ...state,
                id: "",
                registered: false,
                error: action.error,
            };

        case SIGN_IN_SUCCESS_OTP:
            return {
                ...state,
                registered: true,
            };

        case PASSCODE_CHANGED:
            return {
                ...state,
                passcode: action.value.passcode,
            };

        case RESPONSE_RECEIVED:
            return {
                ...state,
                resp: action.value.resp,
            };
    }

    return state;
});
