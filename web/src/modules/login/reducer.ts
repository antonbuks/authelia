import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import { SET_LOGIN_DATA } from "@root/modules/login/actionTypes";
import { AuthenticationLevel } from "@services/State";

const DEFAULT_STATE = {
    authenticationLevel: 0,
    username: "",
};

export interface ILoginState {
    authenticationLevel: AuthenticationLevel;
    username: string;
    firstFactorDisabled?: boolean;
}

ReducerRegistry.register<ILoginState>("modules/login", (state = DEFAULT_STATE, action): ILoginState => {
    switch (action.type) {
        case SET_LOGIN_DATA:
            const { authenticationLevel, username } = action.value;

            return {
                authenticationLevel,
                username,
                firstFactorDisabled: authenticationLevel > AuthenticationLevel.Unauthenticated,
            };
    }

    return state;
});
