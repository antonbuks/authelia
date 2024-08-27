import React, { Component, ComponentType } from 'react';
import { IReduxState } from '../../redux/types';

/**
 * The type of the React {@code Component} props of {@link DialogContainer}.
 */
interface IProps {

    /**
     * The component to render.
     */
    _component?: ComponentType<any>;

    /**
     * The props to pass to the component that will be rendered.
     */
    _componentProps?: Object;
}

/**
 * Implements a DialogContainer responsible for showing all dialogs.
 */
export default class AbstractDialogContainer extends Component<IProps> {
    /**
     * Returns the dialog to be displayed.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderDialogContent() {
        const { _component: component } = this.props;

        return (
            component
                ? React.createElement(component, this.props._componentProps)
                : null);
    }
}

/**
 * Maps (parts of) the redux state to the associated
 * {@code AbstractDialogContainer}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
export function abstractMapStateToProps(state: IReduxState) {
    const stateFeaturesBaseDialog = state['modules/base/dialog'];

    return {
        _component: stateFeaturesBaseDialog.component,
        _componentProps: stateFeaturesBaseDialog.componentProps
    };
}
