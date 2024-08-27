import ReactDOM from "react-dom";

import { App } from "@root/modules/base/app/components/App";

export function getGlobalNS() {
    if (!window.Authelia) {
        window.Authelia = {};
    }

    if (!window.Authelia.app) {
        window.Authelia.app = {};
    }

    return window.Authelia.app;
}

const globalNS = getGlobalNS();

globalNS.entryPoints = {
    APP: App,
};

globalNS.renderEntryPoint = ({ Component, props = {}, elementId = "react" }) => {
    ReactDOM.render(<Component {...props} />, document.getElementById(elementId));
};
