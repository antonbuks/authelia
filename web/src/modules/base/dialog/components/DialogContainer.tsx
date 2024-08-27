import { Fragment } from "react";

import { connect } from "react-redux";

import AbstractDialogContainer, {
    abstractMapStateToProps,
} from "@root/modules/base/dialog/components/AbstractDialogContainer";
import { IReduxState } from "@root/modules/base/redux/types";

/**
 * Implements a DialogContainer responsible for showing all dialogs. We will
 * need a separate container so we can handle multiple dialogs by showing them
 * simultaneously or queueing them.
 *
 * @augments AbstractDialogContainer
 */
class DialogContainer extends AbstractDialogContainer {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return <Fragment>{this._renderDialogContent()}</Fragment>;
    }
}

const mapStateToProps = (state: IReduxState) => {
    return {
        ...abstractMapStateToProps(state),
    };
};

export default connect(mapStateToProps)(DialogContainer);
