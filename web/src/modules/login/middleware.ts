import { APP_WILL_MOUNT } from "@root/modules/base/app/actionTypes";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import { fetchAutheliaState } from "@root/modules/login/actions";

MiddlewareRegistry.register((store) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case APP_WILL_MOUNT: {
            dispatch(fetchAutheliaState());

            break;
        }
    }
});
