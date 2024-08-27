import { APP_WILL_MOUNT } from "@root/modules/base/app/actionTypes";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { IStore } from "@root/modules/base/redux/types";
import { fetchAvailableMethods, setConfigData } from "@root/modules/config/actions";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { AuthenticationLevel } from "@services/State";
import { getEmbeddedVariable } from "@utils/Configuration";

MiddlewareRegistry.register((store: IStore) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case APP_WILL_MOUNT:
            _parseEmbeddedVariables(store);
            break;
        case SET_LOGIN_DATA: {
            const { authenticationLevel } = action.value;

            if (authenticationLevel > AuthenticationLevel.Unauthenticated) {
                dispatch(fetchAvailableMethods());
            }

            break;
        }
    }
});

/**
 * Reduces a specific redux action {@link SET_LOCATION_URL} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @param {Action} action - The redux action {@code SET_LOCATION_URL} to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _parseEmbeddedVariables(store: IStore) {
    const duoSelfEnrollment = getEmbeddedVariable("duoselfenrollment") === "true";
    const logoOverride = getEmbeddedVariable("logooverride") === "true";
    const rememberMe = getEmbeddedVariable("rememberme") === "true";
    const resetPassword = getEmbeddedVariable("resetpassword") === "true";
    const resetPasswordCustomURL = getEmbeddedVariable("resetpasswordcustomurl");
    const privacyPolicyEnabled = getEmbeddedVariable("privacypolicyurl") !== "";
    const privacyPolicyURL = getEmbeddedVariable("privacypolicyurl");
    const privacyPolicyRequireAccept = getEmbeddedVariable("privacypolicyaccept") === "true";
    const theme = getEmbeddedVariable("theme");

    store.dispatch(
        setConfigData({
            duoSelfEnrollment,
            logoOverride,
            rememberMe,
            resetPassword,
            resetPasswordCustomURL,
            privacyPolicyEnabled,
            privacyPolicyURL,
            privacyPolicyRequireAccept,
            theme,
        }),
    );
}
