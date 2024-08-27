import { SecondFactorMethod } from "@models/Methods";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import { SET_CONFIG } from "@root/modules/config/actionTypes";

const DEFAULT_STATE = {
    availableMethods: [],
    duoSelfEnrollment: false,
    logoOverride: false,
    rememberMe: false,
    resetPassword: false,
    resetPasswordCustomURL: "",
    privacyPolicyEnabled: false,
    privacyPolicyURL: "",
    privacyPolicyRequireAccept: false,
    theme: "default",
    notifications: [],
    notificationTimeouts: {
        short: 2500,
        medium: 5000,
        long: 10000,
    },
};

export interface IConfigState {
    availableMethods: SecondFactorMethod[];
    duoSelfEnrollment: boolean;
    logoOverride: boolean;
    rememberMe: boolean;
    resetPassword: boolean;
    resetPasswordCustomURL: string;
    privacyPolicyEnabled: boolean;
    privacyPolicyURL: string;
    privacyPolicyRequireAccept: boolean;
    theme: string;
    notificationTimeouts?: {
        long?: number;
        medium?: number;
        short?: number;
    };
    notifications?: Array<string>;
}

ReducerRegistry.register<IConfigState>("modules/config", (state = DEFAULT_STATE, action): IConfigState => {
    switch (action.type) {
        case SET_CONFIG:
            const config = action.value;

            return {
                state,
                ...config,
            };
    }

    return state;
});
