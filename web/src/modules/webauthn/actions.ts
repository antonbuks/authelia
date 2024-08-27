import { AssertionResult, AssertionResultFailureString, WebAuthnTouchState } from "@models/WebAuthn";
import { IStore } from "@root/modules/base/redux/types";
import {
    REGISTER_WEBAUTHN,
    SIGN_IN_ERROR_WEBAUTHN,
    SIGN_IN_SUCCESS_WEBAUTHN,
    STATE_CHANGE_WEBAUTHN,
} from "@root/modules/webauthn/actionTypes";
import { AuthenticationLevel } from "@services/State";
import { getAuthenticationOptions, getAuthenticationResult, postAuthenticationResponse } from "@services/WebAuthn";

/**
 * onRegisterClick
 */
export function onRegisterClick(id: string) {
    return {
        type: REGISTER_WEBAUTHN,
        id,
    };
}

/**
 * onSignInError
 */
export function onSignInError(err: any) {
    return {
        type: SIGN_IN_ERROR_WEBAUTHN,
        error: err,
    };
}

/**
 * onSignInSuccess
 */
export function onSignInSuccess(redirectURL?: string) {
    return {
        type: SIGN_IN_SUCCESS_WEBAUTHN,
        redirectURL,
    };
}

/**
 * doInitiateSignIn
 */
export function doInitiateSignIn() {
    return async function (dispatch: IStore["dispatch"], getState: IStore["getState"]) {
        const { authenticationLevel } = getState()["modules/login"];
        const { registered } = getState()["modules/webauthn"];

        if (!registered || authenticationLevel === AuthenticationLevel.TwoFactor) {
            return;
        }

        dispatch({
            type: STATE_CHANGE_WEBAUTHN,
            state: WebAuthnTouchState.WaitTouch,
        });

        try {
            const optionsStatus = await getAuthenticationOptions();
            if (optionsStatus.status !== 200 || !optionsStatus.options) {
                dispatch(onSignInError("Failed to initiate security key sign in process"));
                return;
            }

            const result = await getAuthenticationResult(optionsStatus.options);
            if (result.result !== AssertionResult.Success) {
                dispatch(onSignInError(AssertionResultFailureString(result.result)));
                return;
            }

            if (!result.response) {
                dispatch(onSignInError("The browser did not respond with the expected attestation data"));
                return;
            }

            dispatch({
                type: STATE_CHANGE_WEBAUTHN,
                state: WebAuthnTouchState.InProgress,
            });

            const response = await postAuthenticationResponse(result.response, redirectionURL, workflow, workflowID);

            if (response.data.status === "OK" && response.status === 200) {
                dispatch(onSignInSuccess(response.data.data?.redirect));
            } else {
                dispatch(onSignInError("The server rejected the security key"));
            }
        } catch (error) {
            dispatch(onSignInError(error));
        }
    };
}
