import React, { Component, ComponentType, Fragment } from "react";

import _ from "lodash";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { compose, createStore } from "redux";
import Thunk from "redux-thunk";

import { appWillMount, appWillUnmount } from "@root/modules/base/app/actions";
import { autheliaLocalStorage } from "@root/modules/base/redux/LocalStorage";
import MiddlewareRegistry from "@root/modules/base/redux/MiddlewareRegistry";
import PersistenceRegistry from "@root/modules/base/redux/PersistenceRegistry";
import ReducerRegistry from "@root/modules/base/redux/ReducerRegistry";
import StateListenerRegistry from "@root/modules/base/redux/StateListenerRegistry";
import { IStore } from "@root/modules/base/redux/types";
import { createDeferred } from "@root/util/helpers";

// suggesting @i18n which breaks
// eslint-disable-next-line @limegrass/import-alias/import-alias
import i18next from "../../../../i18n";

/**
 * The type of the React {@code Component} state of {@link BaseApp}.
 */
interface IState {
    /**
     * The {@code Route} rendered by the {@code BaseApp}.
     */
    route: {
        component?: ComponentType;
        props?: Object;
    };

    /**
     * The redux store used by the {@code BaseApp}.
     */
    store?: IStore;
}

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export default class BaseApp<P> extends Component<P, IState> {
    /**
     * The deferred for the initialization {{promise, resolve, reject}}.
     */
    _init?: {
        promise: Promise<any>;
    };

    /**
     * Initializes a new {@code BaseApp} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: P) {
        super(props);

        this.state = {
            route: {},
            store: undefined,
        };
    }

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    async componentDidMount() {
        /**
         * Make the mobile {@code BaseApp} wait until the {@code AsyncStorage}
         * implementation of {@code Storage} initializes fully.
         *
         * @private
         * @see {@link #_initStorage}
         * @type {Promise}
         */
        this._init = createDeferred();

        try {
            await this._initStorage();

            const setStatePromise = new Promise((resolve) => {
                this.setState(
                    {
                        // @ts-ignore
                        store: this._createStore(),
                    },
                    resolve,
                );
            });

            await setStatePromise;

            await this._extraInit();
        } catch (err) {
            /* BaseApp should always initialize! */
            console.error(err);
        }

        this.state.store?.dispatch(appWillMount(this));

        // @ts-ignore
        this._init.resolve();
    }

    /**
     * De-initializes the app.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this.state.store?.dispatch(appWillUnmount(this));
    }

    /**
     * Delays this {@code BaseApp}'s startup until the {@code Storage}
     * implementation of {@code localStorage} initializes. While the
     * initialization is instantaneous on Web (with Web Storage API), it is
     * asynchronous on mobile/react-native.
     *
     * @private
     * @returns {Promise}
     */
    _initStorage(): Promise<any> {
        const _initializing = autheliaLocalStorage.getItem("_initializing");

        return _initializing || Promise.resolve();
    }

    /**
     * Extra initialisation that subclasses might require.
     *
     * @returns {void}
     */
    _extraInit() {
        // To be implemented by subclass.
    }

    /**
     * Creates an element for notifications..
     *
     * @returns {ReactElement}
     * @abstract
     * @protected
     */
    _createNotificationsElement(): React.ReactElement | null {
        return null;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            route: { component, props },
            store,
        } = this.state;

        if (store) {
            return (
                <I18nextProvider i18n={i18next}>
                    {/* @ts-ignore TODO: not sure why this is broken */}
                    <Provider store={store}>
                        <Fragment>
                            {this._createMainElement(component, props)}
                            {this._createNotificationsElement()}
                            {this._createExtraElement()}
                        </Fragment>
                    </Provider>
                </I18nextProvider>
            );
        }

        return null;
    }

    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @returns {ReactElement}
     * @abstract
     * @protected
     */
    _createExtraElement(): React.ReactElement | null {
        return null;
    }

    /**
     * Creates a {@link ReactElement} from the specified component, the
     * specified props and the props of this {@code AbstractApp} which are
     * suitable for propagation to the children of this {@code Component}.
     *
     * @param {Component} component - The component from which the
     * {@code ReactElement} is to be created.
     * @param {Object} props - The read-only React {@code Component} props with
     * which the {@code ReactElement} is to be initialized.
     * @returns {ReactElement}
     * @protected
     */
    _createMainElement(component?: ComponentType, props?: Object) {
        return component ? React.createElement(component, props || {}) : null;
    }

    /**
     * Initializes a new redux store instance suitable for use by this
     * {@code AbstractApp}.
     *
     * @private
     * @returns {Store} - A new redux store instance suitable for use by
     * this {@code AbstractApp}.
     */
    _createStore() {
        // Create combined reducer from all reducers in ReducerRegistry.
        const reducer = ReducerRegistry.combineReducers();

        // Apply all registered middleware from the MiddlewareRegistry and
        // additional 3rd party middleware:
        const middleware = MiddlewareRegistry.applyMiddleware(Thunk);

        // @ts-ignore
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(reducer, PersistenceRegistry.getPersistedState(), composeEnhancers(middleware));

        // StateListenerRegistry
        StateListenerRegistry.subscribe(store);

        return store;
    }

    /**
     * Navigates to a specific Route.
     *
     * @param {Route} route - The Route to which to navigate.
     * @returns {Promise}
     */
    _navigate(route: { component?: ComponentType<any>; href?: string; props?: Object }): Promise<any> {
        if (_.isEqual(route, this.state.route)) {
            return Promise.resolve();
        }

        if (route.href) {
            // This navigation requires loading a new URL in the browser.
            window.location.href = route.href;

            return Promise.resolve();
        }

        // XXX React's setState is asynchronous which means that the value of
        // this.state.route above may not even be correct. If the check is
        // performed before setState completes, the app may not navigate to the
        // expected route. In order to mitigate the problem, _navigate was
        // changed to return a Promise.
        return new Promise((resolve) => {
            // @ts-ignore
            this.setState({ route }, resolve);
        });
    }
}
