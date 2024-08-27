import { Component, Fragment, ReactNode } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import { AuthenticatedRoute, IndexRoute, SecondFactorRoute } from "@constants/Routes";
import FirstFactorForm from "@root/modules/auth/components/FirstFactorForm";
import SecondFactorForm from "@root/modules/auth/components/SecondFactorForm";
import { IReduxState } from "@root/modules/base/redux/types";
import AuthenticatedView from "@root/modules/login/components/Authenticated";
import { isFirstFactorReady, isSecondFactorReady } from "@root/modules/login/functions";
import LoadingPage from "@views/LoadingPage/LoadingPage";

const LoginPortal = () => {
    const userInfo = useSelector((state: IReduxState) => state["modules/user"]);
    const firstFactorReady = useSelector(isFirstFactorReady);
    const secondFactorReady = useSelector(isSecondFactorReady);
    return (
        <Routes>
            <Route
                path={IndexRoute}
                element={
                    <ComponentOrLoading ready={firstFactorReady}>
                        <FirstFactorForm />
                    </ComponentOrLoading>
                }
            />
            {/* <Route path={`${SecondFactorRoute}/*`} element={secondFactorReady ? <SecondFactorForm /> : null} /> */}
            {/* <Route path={AuthenticatedRoute} element={userInfo ? <AuthenticatedView /> : null} /> */}
        </Routes>
    );
};

interface ComponentOrLoadingProps extends React.PropsWithChildren {
    ready: boolean;
}

function ComponentOrLoading(props: ComponentOrLoadingProps) {
    return (
        <Fragment>
            <div className={props.ready ? "hidden" : ""}>
                <LoadingPage />
            </div>
            {props.ready ? props.children : null}
        </Fragment>
    );
}

export default LoginPortal;
