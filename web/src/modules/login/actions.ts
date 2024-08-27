import {
    AuthenticatedRoute,
    IndexRoute,
    SecondFactorPushSubRoute,
    SecondFactorRoute,
    SecondFactorTOTPSubRoute,
    SecondFactorWebAuthnSubRoute,
} from "@constants/Routes";
import { SecondFactorMethod } from "@models/Methods";
import { appNavigate } from "@root/modules/base/app/actions";
import { IStore } from "@root/modules/base/redux/types";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { ILoginState } from "@root/modules/login/reducer";
import { StatePath } from "@services/Api";
import { AutheliaState, AuthenticationLevel } from "@services/State";

export function fetchAutheliaState() {
    return async function (dispatch: IStore["dispatch"]) {
        try {
            const response = await fetch(StatePath);
            if (response.ok) {
                const result: AutheliaState = await response.json();
                return dispatch(
                    setLoginData({
                        authenticationLevel: result.authentication_level,
                        username: result.username,
                    }),
                );
            }
        } catch (error) {
            console.warn(error);
        }
    };
}

/**
 * Action used to set the login data.
 *
 * @param {Object} value - The data to be set.
 * @returns {Object}
 */
export function setLoginData(value: ILoginState) {
    return async function (dispatch: IStore["dispatch"], getState: IStore["getState"]) {
        const config = getState()["modules/config"];
        const userInfo = getState()["modules/user"];
        const { authenticationLevel } = value;

        dispatch({
            type: SET_LOGIN_DATA,
            value,
        });

        if (authenticationLevel === AuthenticationLevel.Unauthenticated) {
            // setFirstFactorDisabled(false);
            dispatch(appNavigate(IndexRoute));
        } else if (authenticationLevel >= AuthenticationLevel.OneFactor && userInfo && config) {
            if (config.availableMethods.length === 0) {
                dispatch(appNavigate(AuthenticatedRoute));
            } else {
                const method = userInfo.method;

                if (method === SecondFactorMethod.WebAuthn) {
                    dispatch(appNavigate(`${SecondFactorRoute}${SecondFactorWebAuthnSubRoute}`));
                } else if (method === SecondFactorMethod.MobilePush) {
                    dispatch(appNavigate(`${SecondFactorRoute}${SecondFactorPushSubRoute}`));
                } else {
                    dispatch(appNavigate(`${SecondFactorRoute}${SecondFactorTOTPSubRoute}`));
                }
            }
        }
    };
}
