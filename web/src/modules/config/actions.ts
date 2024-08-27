import { showErrorNotification } from "@root/modules/base/notifications/actions";
import { IStore } from "@root/modules/base/redux/types";
import { SET_CONFIG } from "@root/modules/config/actionTypes";
import { IConfigState } from "@root/modules/config/reducer";
import { StatePath } from "@services/Api";
import { ConfigurationPayload } from "@services/Configuration";
import { toSecondFactorMethod } from "@services/UserInfo";

export function fetchAvailableMethods() {
    return async function (dispatch: IStore["dispatch"]) {
        try {
            const response = await fetch(StatePath);
            if (response.ok) {
                const result = (await response.json()) as ConfigurationPayload;
                return dispatch(
                    setConfigData({
                        availableMethods: [...new Set(result.available_methods.map(toSecondFactorMethod))],
                    }),
                );
            }
        } catch (error) {
            showErrorNotification({ title: "There was an issue retrieving global configuration" });
        }
    };
}

/**
 * Action used to set the config data.
 *
 * @param {Object} value - The data to be set.
 * @returns {Object}
 */
export function setConfigData(value: Partial<IConfigState>) {
    return {
        type: SET_CONFIG,
        value,
    };
}
