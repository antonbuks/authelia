import { SecondFactorTOTPSubRoute, SecondFactorWebAuthnSubRoute } from "@constants/Routes";
import FirstFactorForm from "@root/modules/auth/components/FirstFactorForm";
import BlankPage from "@root/modules/base/app/components/BlankPage";
import { URI_PROTOCOL_PATTERN, _URI_AUTHORITY_PATTERN, _URI_PATH_PATTERN } from "@root/modules/base/app/constants";
import { toState } from "@root/modules/base/redux/functions";
import { IReduxState, IStateful } from "@root/modules/base/redux/types";
import OneTimePasswordMethod from "@root/modules/otp/components/OneTimePasswordMethod";
import WebAuthnMethod from "@root/modules/webauthn/components/WebAuthnMethod";
import { AuthenticationLevel } from "@services/State";
import LoadingPage from "@views/LoadingPage/LoadingPage";

/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {(Function|Object)} stateful - THe redux store, state, or
 * {@code getState} function.
 * @returns {Promise<Object>}
 */
export function _getRouteToRender(stateful: IStateful) {
    const state = toState(stateful);

    return _getLoginPortalRoute(state) || _getLoadingPage(state);
}

/**
 * Returns the {@code Route} to display when trying to access the welcome page.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Object>}
 */
function _getLoginPortalRoute(state: IReduxState) {
    const route = _getEmptyRoute();
    const { locationURL } = state["modules/app"];
    const { authenticationLevel } = state["modules/login"];

    const firstFactorReady = authenticationLevel === AuthenticationLevel.Unauthenticated;

    if (window.location.href !== locationURL?.href) {
        route.href = locationURL?.href;

        return Promise.resolve(route);
    }

    if (firstFactorReady) {
        route.component = <FirstFactorForm />;

        return Promise.resolve(route);
    }

    if (locationURL.pathname === SecondFactorTOTPSubRoute) {
        route.component = <OneTimePasswordMethod />;

        return Promise.resolve(route);
    }

    if (locationURL.pathname === SecondFactorWebAuthnSubRoute) {
        route.component = <WebAuthnMethod />;

        return Promise.resolve(route);
    }

    // route.component = <LoginPortal />;

    // return Promise.resolve(route);
}

/**
 * Parses a specific URI string into an object with the well-known properties of
 * the {@link Location} and/or {@link URL} interfaces implemented by Web
 * browsers. The parsing attempts to be in accord with IETF's RFC 3986.
 *
 * @param {string} str - The URI string to parse.
 * @public
 * @returns {{
 *     hash: string,
 *     host: (string|undefined),
 *     hostname: (string|undefined),
 *     pathname: string,
 *     port: (string|undefined),
 *     protocol: (string|undefined),
 *     search: string
 * }}
 */
export function _parseURIString(str: string) {
    const obj: { [key: string]: any } = {
        toString: _standardURIToString,
    };

    let regex;
    let match: Array<string> | null;

    str = str.replace(/\s/g, "");

    // protocol
    regex = new RegExp(URI_PROTOCOL_PATTERN, "gi");
    match = regex.exec(str);
    if (match) {
        obj.protocol = match[1].toLowerCase();
        str = str.substring(regex.lastIndex);
    }

    // authority
    regex = new RegExp(`^${_URI_AUTHORITY_PATTERN}`, "gi");
    match = regex.exec(str);
    if (match) {
        let authority: string = match[1].substring(/* // */ 2);

        str = str.substring(regex.lastIndex);

        // userinfo
        const userinfoEndIndex = authority.indexOf("@");

        if (userinfoEndIndex !== -1) {
            authority = authority.substring(userinfoEndIndex + 1);
        }

        obj.host = authority;

        // port
        const portBeginIndex = authority.lastIndexOf(":");

        if (portBeginIndex !== -1) {
            obj.port = authority.substring(portBeginIndex + 1);
            authority = authority.substring(0, portBeginIndex);
        }

        // hostname
        obj.hostname = authority;
    }

    // pathname
    regex = new RegExp(`^${_URI_PATH_PATTERN}`, "gi");
    match = regex.exec(str);

    let pathname: string | undefined;

    if (match) {
        pathname = match[1];
        str = str.substring(regex.lastIndex);
    }
    if (pathname) {
        pathname.startsWith("/") || (pathname = `/${pathname}`);
    } else {
        pathname = "/";
    }
    obj.pathname = pathname;

    // query
    if (str.startsWith("?")) {
        let hashBeginIndex = str.indexOf("#", 1);

        if (hashBeginIndex === -1) {
            hashBeginIndex = str.length;
        }
        obj.search = str.substring(0, hashBeginIndex);
        str = str.substring(hashBeginIndex);
    } else {
        obj.search = ""; // Google Chrome
    }

    return obj;
}

/**
 * Implements {@code href} and {@code toString} for the {@code Object} returned
 * by {@link #parseStandardURIString}.
 *
 * @param {Object} [thiz] - An {@code Object} returned by
 * {@code #parseStandardURIString} if any; otherwise, it is presumed that the
 * function is invoked on such an instance.
 * @returns {string}
 */
function _standardURIToString(thiz?: Object) {
    // @ts-ignore
    const { hash, host, pathname, protocol, search } = thiz || this;
    let str = "";

    protocol && (str += protocol);

    host && (str += `//${host}`);
    str += pathname || "/";
    search && (str += search);
    hash && (str += hash);

    return str;
}

/**
 * Returns the {@code Route} to display when trying to access the welcome page.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Object>}
 */
function _getLoadingPage(state: IReduxState) {
    const route = _getEmptyRoute();
    route.component = <LoadingPage />;

    return Promise.resolve(route);
}

/**
 * Returns the default {@code Route}.
 *
 * @returns {Object}
 */
function _getEmptyRoute(): {
    component: React.ReactNode;
    href?: string;
} {
    return {
        component: BlankPage,
        href: undefined,
    };
}
