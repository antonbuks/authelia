import { showErrorNotification } from "@root/modules/base/notifications/actions";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { doInitiateSignIn } from "@root/modules/webauthn/actions";
import { SIGN_IN_ERROR_WEBAUTHN } from "@root/modules/webauthn/actionTypes";

MiddlewareRegistry.register((store) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case SET_LOGIN_DATA: {
            dispatch(doInitiateSignIn());

            break;
        }
        case SIGN_IN_ERROR_WEBAUTHN: {
            const { error } = action.value;
            dispatch(showErrorNotification({ title: error }));

            break;
        }
    }
});
