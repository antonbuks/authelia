import { UserInfoTOTPConfiguration, toEnum } from "@models/TOTPConfiguration";
import { IStore } from "@root/modules/base/redux/types";
import {
    PASSCODE_CHANGED,
    REGISTER_OTP,
    RESPONSE_RECEIVED,
    SIGN_IN_ERROR_OTP,
    SIGN_IN_SUCCESS_OTP,
    STATE_CHANGE_OTP,
} from "@root/modules/otp/actionTypes";
import { toUserInfoTOTPConfiguration } from "@root/modules/otp/functions";
import { State } from "@root/modules/otp/reducer";
import { TOTPConfigurationPath } from "@services/Api";
import { Get } from "@services/Client";
import { completeTOTPSignIn } from "@services/OneTimePassword";
import { AuthenticationLevel } from "@services/State";
import { UserInfoTOTPConfigurationPayload } from "@services/UserInfoTOTPConfiguration";

/**
 * onRegisterClick
 */
export function onRegisterClick(id: string) {
    return {
        type: REGISTER_OTP,
        id,
    };
}

/**
 * onSignInError
 */
export function onSignInError(err: Error) {
    return {
        type: SIGN_IN_ERROR_OTP,
        error: err,
    };
}

/**
 * onSignInSuccess
 */
export function onSignInSuccess(redirectURL?: string) {
    return {
        type: SIGN_IN_SUCCESS_OTP,
        redirectURL,
    };
}

/**
 * setOTPState
 */
export function setOTPState(state: number) {
    return {
        type: STATE_CHANGE_OTP,
        state,
    };
}

/**
 * setOTPState
 */
export function setPasscode(passcode: string) {
    return {
        type: PASSCODE_CHANGED,
        passcode,
    };
}

export function fetchUserTOTPConfiguration() {
    return async function (dispatch: IStore["dispatch"]) {
        const res = await Get<UserInfoTOTPConfigurationPayload>(TOTPConfigurationPath);

        return dispatch({
            type: RESPONSE_RECEIVED,
            resp: toUserInfoTOTPConfiguration(res),
        });
    };
}

/**
 * doInitiateSignIn
 */
export function doInitiateSignIn() {
    return async function (dispatch: IStore["dispatch"], getState: IStore["getState"]) {
        const { authenticationLevel } = getState()["modules/login"];
        const { registered, passcode, resp } = getState()["modules/otp"];

        if (!registered || authenticationLevel === AuthenticationLevel.TwoFactor) {
            return;
        }

        const passcodeStr = `${passcode}`;

        if (!passcode || passcodeStr.length !== (resp?.digits || 6)) {
            return;
        }

        try {
            setOTPState(State.InProgress);
            const res = await completeTOTPSignIn(passcodeStr, redirectionURL, workflow, workflowID);
            setOTPState(State.Success);
            onSignInSuccess(res ? res.redirect : undefined);
        } catch (err) {
            console.error(err);
            // translate("The One-Time Password might be wrong")
            onSignInError(new Error("The One-Time Password might be wrong"));
            setOTPState(State.Failure);
        }
        dispatch(setPasscode(""));
    };
}
