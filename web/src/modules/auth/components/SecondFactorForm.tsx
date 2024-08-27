import { FC, lazy, useEffect } from "react";

import { Button, Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import {
    SecondFactorPushSubRoute,
    SecondFactorTOTPSubRoute,
    SecondFactorWebAuthnSubRoute,
    LogoutRoute as SignOutRoute,
} from "@constants/Routes";
import { setMethodSelectionOpen, setWebAuthnSupported } from "@root/modules/auth/actions";
import MethodSelectionDialog from "@root/modules/auth/components/MethodSelectionDialog";
import { appNavigate } from "@root/modules/base/app/actions";
import { IReduxState } from "@root/modules/base/redux/types";
import LoginLayout from "@root/modules/login/components/LoginLayout";
import OneTimePasswordMethod from "@root/modules/otp/components/OneTimePasswordMethod";
import PushNotificationMethod from "@root/modules/push-notification/components/PushNotificationMethod";
import WebAuthnMethod from "@root/modules/webauthn/components/WebAuthnMethod";

// const OneTimePasswordMethod = lazy(() => import("@views/LoginPortal/SecondFactor/OneTimePasswordMethod"));
// const PushNotificationMethod = lazy(() => import("@views/LoginPortal/SecondFactor/PushNotificationMethod"));
// const WebAuthnMethod = lazy(() => import("@views/LoginPortal/SecondFactor/WebAuthnMethod"));

// export interface Props {
//     authenticationLevel: AuthenticationLevel;
//     configuration: Configuration;
//     duoSelfEnrollment: boolean;

//     onMethodChanged: () => void;
// };

const SecondFactorForm: FC = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const styles = useStyles();
    const { t: translate } = useTranslation();

    const availableMethods = useSelector((state: IReduxState) => state["modules/config"].availableMethods);
    const userInfo = useSelector((state: IReduxState) => state["modules/user"]);

    useEffect(() => {
        dispatch(setWebAuthnSupported(browserSupportsWebAuthn()));
    }, [dispatch]);

    const handleMethodSelectionClick = () => {
        dispatch(setMethodSelectionOpen(true));
    };

    const handleLogoutClick = () => {
        dispatch(appNavigate(SignOutRoute));
    };

    return (
        <LoginLayout id="second-factor-stage" title={`${translate("Hi")} ${userInfo.displayName}`} userInfo={userInfo}>
            {availableMethods.length > 1 ? <MethodSelectionDialog /> : null}
            <Grid container>
                <Grid item xs={12}>
                    <Button color="secondary" onClick={handleLogoutClick} id="logout-button">
                        {translate("Logout")}
                    </Button>
                    {availableMethods.length > 1 && (
                        <Button color="secondary" onClick={handleMethodSelectionClick} id="methods-button">
                            {translate("Methods")}
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} className={styles.methodContainer}>
                    <Routes>
                        <Route path={SecondFactorTOTPSubRoute} element={<OneTimePasswordMethod />} />
                        <Route path={SecondFactorWebAuthnSubRoute} element={<WebAuthnMethod />} />
                        {/* <Route
                            path={SecondFactorPushSubRoute}
                            element={
                                <PushNotificationMethod
                                // id="push-notification-method"
                                // authenticationLevel={authenticationLevel}
                                // duoSelfEnrollment={duoSelfEnrollment}
                                // registered={userInfo.hasDuo}
                                // onSelectionClick={onMethodChanged}
                                // onSignInError={(err) => createErrorNotification(err.message)}
                                // onSignInSuccess={onAuthenticationSuccess}
                                />
                            }
                        /> */}
                    </Routes>
                </Grid>
            </Grid>
        </LoginLayout>
    );
};

export default SecondFactorForm;

const useStyles = makeStyles((theme: Theme) => ({
    methodContainer: {
        border: "1px solid #d6d6d6",
        borderRadius: "10px",
        padding: theme.spacing(4),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));
