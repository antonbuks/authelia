import { showErrorNotification } from "@root/modules/base/notifications/actions";
import { IStore } from "@root/modules/base/redux/types";
import { SET_USER_DATA } from "@root/modules/user/actionTypes";
import { IUserState } from "@root/modules/user/reducer";
import { UserInfoPath } from "@services/Api";
import { UserInfoPayload, toSecondFactorMethod } from "@services/UserInfo";

export function fetchUserData() {
    return async function (dispatch: IStore["dispatch"]) {
        try {
            const response = await fetch(UserInfoPath);
            if (response.ok) {
                const result: UserInfoPayload = await response.json();
                return dispatch(
                    setUserData({
                        displayName: result.display_name,
                        method: toSecondFactorMethod(result.method),
                        hasWebauthn: result.has_webauthn,
                        hasTotp: result.has_totp,
                        hasDuo: result.has_duo,
                    }),
                );
            }
        } catch (error) {
            showErrorNotification({ title: "There was an issue retrieving the current user state" });
        }
    };
}

/**
 * Action used to set the user data.
 *
 * @param {Object} value - The data to be set.
 * @returns {Object}
 */
export function setUserData(value: Partial<IUserState>) {
    return {
        type: SET_USER_DATA,
        value,
    };
}
