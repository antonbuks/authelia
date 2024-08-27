import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { IAuthState } from "@root/modules/auth/reducer";
import { IAppState } from "@root/modules/base/app/reducer";
import { IDialogState } from "@root/modules/base/dialog/reducer";
import { INotificationsState } from "@root/modules/base/notifications/reducer";
import { IConfigState } from "@root/modules/config/reducer";
import { ILoginState } from "@root/modules/login/reducer";
import { IOTPState } from "@root/modules/otp/reducer";
import { IUserState } from "@root/modules/user/reducer";
import { IWebAuthnState } from "@root/modules/webauthn/reducer";

export interface IStore {
    dispatch: ThunkDispatch<IReduxState, void, AnyAction>;
    getState: () => IReduxState;
}

export interface IReduxState {
    "modules/base/dialog": IDialogState;
    "modules/base/notifications": INotificationsState;
    "modules/app": IAppState;
    "modules/auth": IAuthState;
    "modules/login": ILoginState;
    "modules/otp": IOTPState;
    "modules/webauthn": IWebAuthnState;
    "modules/user": IUserState;
    "modules/config": IConfigState;
}

export type IStateful = (() => IReduxState) | IStore | IReduxState;
