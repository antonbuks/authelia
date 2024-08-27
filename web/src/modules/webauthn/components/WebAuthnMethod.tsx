import { FC } from "react";

import { useDispatch, useSelector } from "react-redux";

import WebAuthnTryIcon from "@components/WebAuthnTryIcon";
import { SettingsRoute, SettingsTwoFactorAuthenticationSubRoute } from "@constants/Routes";
import { RedirectionURL } from "@constants/SearchParams";
import { useQueryParam } from "@hooks/QueryParam";
import MethodContainer, { State as MethodContainerState } from "@root/modules/auth/components/MethodContainer";
import { appNavigate } from "@root/modules/base/app/actions";
import { IReduxState } from "@root/modules/base/redux/types";
import { doInitiateSignIn } from "@root/modules/webauthn/actions";
import { AuthenticationLevel } from "@services/State";

const WebAuthnMethod: FC = () => {
    const dispatch = useDispatch();
    const authenticationLevel = useSelector((state: IReduxState) => state["modules/login"].authenticationLevel);
    const { state, id } = useSelector((state: IReduxState) => state["modules/webauthn"]);
    const { hasWebauthn } = useSelector((state: IReduxState) => state["modules/user"]);

    const redirectionURL = useQueryParam(RedirectionURL);
    // const [workflow, workflowID] = useWorkflow();

    const methodState = hasWebauthn
        ? authenticationLevel === AuthenticationLevel.TwoFactor
            ? MethodContainerState.ALREADY_AUTHENTICATED
            : MethodContainerState.METHOD
        : MethodContainerState.NOT_REGISTERED;

    return (
        <MethodContainer
            id={id}
            title="Security Key"
            explanation="Touch the token of your security key"
            duoSelfEnrollment={false}
            registered={hasWebauthn}
            onRegisterClick={() => dispatch(appNavigate(`${SettingsRoute}${SettingsTwoFactorAuthenticationSubRoute}`))}
            state={methodState}
        >
            <WebAuthnTryIcon onRetryClick={() => dispatch(doInitiateSignIn())} webauthnTouchState={state} />
        </MethodContainer>
    );
};

export default WebAuthnMethod;
