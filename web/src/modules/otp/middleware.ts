import { showErrorNotification } from "@root/modules/base/notifications/actions";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { fetchUserTOTPConfiguration, setOTPState } from "@root/modules/otp/actions";
import { SIGN_IN_ERROR_OTP } from "@root/modules/otp/actionTypes";
import { State } from "@root/modules/otp/reducer";
import { SET_USER_DATA } from "@root/modules/user/actionTypes";
import { AuthenticationLevel } from "@services/State";

MiddlewareRegistry.register((store) => (next) => (action) => {
    const { dispatch, getState } = store;
    switch (action.type) {
        case SET_LOGIN_DATA: {
            const { authenticationLevel } = action.value;

            dispatch(setOTPState(authenticationLevel === AuthenticationLevel.TwoFactor ? State.Success : State.Idle));

            break;
        }
        case SET_USER_DATA: {
            const { hasTotp } = action.value;
            const { authenticationLevel } = getState()["modules/login"];

            if (hasTotp && authenticationLevel === AuthenticationLevel.OneFactor) {
                dispatch(fetchUserTOTPConfiguration());
            }

            break;
        }
        case SIGN_IN_ERROR_OTP: {
            const { error } = action.value;

            dispatch(showErrorNotification({ title: error }));

            break;
        }
    }
});
