import { FC, useState } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RedirectionURL } from "@constants/SearchParams";
import { useQueryParam } from "@hooks/QueryParam";
import MethodContainer, { State as MethodContainerState } from "@root/modules/auth/components/MethodContainer";
import { IReduxState } from "@root/modules/base/redux/types";
import { onRegisterClick } from "@root/modules/otp/actions";
import OTPDial from "@root/modules/otp/components/OTPDial";
import { AuthenticationLevel } from "@services/State";
import LoadingPage from "@views/LoadingPage/LoadingPage";

const OneTimePasswordMethod: FC = () => {
    const dispatch = useDispatch();
    const { t: translate } = useTranslation();
    const authenticationLevel = useSelector((state: IReduxState) => state["modules/login"].authenticationLevel);
    const { state, id, resp, error } = useSelector((state: IReduxState) => state["modules/otp"]);
    const { hasTotp } = useSelector((state: IReduxState) => state["modules/user"]);

    const [passcode, setPasscode] = useState("");

    const redirectionURL = useQueryParam(RedirectionURL);

    let methodState = MethodContainerState.METHOD;
    if (authenticationLevel === AuthenticationLevel.TwoFactor) {
        methodState = MethodContainerState.ALREADY_AUTHENTICATED;
    } else if (!hasTotp) {
        methodState = MethodContainerState.NOT_REGISTERED;
    }

    return (
        <MethodContainer
            id={id}
            title={translate("One-Time Password")}
            explanation={translate("Enter One-Time Password")}
            duoSelfEnrollment={false}
            registered={hasTotp}
            state={methodState}
            onRegisterClick={() => dispatch(onRegisterClick(id))}
        >
            <div>
                {resp !== undefined || error !== undefined ? (
                    <OTPDial
                        passcode={passcode}
                        period={resp?.period || 30}
                        digits={resp?.digits || 6}
                        onChange={setPasscode}
                        state={state}
                    />
                ) : (
                    <LoadingPage />
                )}
            </div>
        </MethodContainer>
    );
};

export default OneTimePasswordMethod;
