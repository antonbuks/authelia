import { SIGN_IN } from "@root/modules/auth/actionTypes";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";

MiddlewareRegistry.register((store) => (next) => (action) => {
    switch (action.type) {
        case SIGN_IN: {
            const { url } = action;

            _handleSignIn(store, url);

            break;
        }
    }
});

function _handleSignIn(store, url) {}
