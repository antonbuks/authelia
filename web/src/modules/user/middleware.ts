import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { SIGN_IN_SUCCESS_OTP } from "@root/modules/otp/actionTypes";
import { fetchUserData, setUserData } from "@root/modules/user/actions";
import { SIGN_IN_SUCCESS_WEBAUTHN } from "@root/modules/webauthn/actionTypes";
import { AuthenticationLevel } from "@services/State";

MiddlewareRegistry.register((store) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case SET_LOGIN_DATA: {
            const { authenticationLevel } = action.value;

            if (authenticationLevel > AuthenticationLevel.Unauthenticated) {
                dispatch(fetchUserData());
            }

            break;
        }
        case SIGN_IN_SUCCESS_OTP: {
            dispatch(setUserData({ hasTotp: true }));

            break;
        }
        case SIGN_IN_SUCCESS_WEBAUTHN: {
            dispatch(setUserData({ hasWebauthn: true }));

            break;
        }
    }
});
