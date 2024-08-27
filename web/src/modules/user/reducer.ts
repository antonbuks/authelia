import { SecondFactorMethod } from "@models/Methods";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import { SET_USER_DATA } from "@root/modules/user/actionTypes";
import { Method2FA } from "@services/UserInfo";

const DEFAULT_STATE = {
    displayName: "",
    method: undefined,
    hasWebauthn: false,
    hasTotp: false,
    hasDuo: false,
};

export interface IUserState {
    displayName: string;
    method?: SecondFactorMethod;
    hasWebauthn: boolean;
    hasTotp: boolean;
    hasDuo: boolean;
}

ReducerRegistry.register<IUserState>("modules/user", (state = DEFAULT_STATE, action): IUserState => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.vale,
            };
    }

    return state;
});
