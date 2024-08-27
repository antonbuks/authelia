import { useCallback, useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SnackbarContent from "@mui/material/SnackbarContent";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { SnackbarKey, useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { hideNotification } from "@root/modules/base/notifications/actions";
import { areThereNotifications } from "@root/modules/base/notifications/functions";
import { IReduxState } from "@root/modules/base/redux/types";

const _timeouts = new Map();

interface INotification {
    component: Object;
    props: {
        appearance?: string;
        descriptionKey?: string;
        titleKey: string;
    };
    timeout: number;
    uid: string;
}

const makeClasses = makeStyles(() => {
    return {
        title: {
            fontWeight: 600,
        },
        btnContainer: {
            marginTop: "10px",
        },
    };
});

/**
 * Description formatter.
 *
 * @param {Object} props - Message props.
 * @param {Function} trans - Translate function.
 * @returns {string}
 */
function _getDescription(props, trans) {
    const { description, descriptionArguments, descriptionKey } = props;

    const descriptionArray = [];

    descriptionKey && descriptionArray.push(trans(descriptionKey, descriptionArguments));

    description && descriptionArray.push(description);

    return descriptionArray.join(" ");
}

/**
 * Returns notification message.
 *
 * @param {string} key - Notification key.
 * @param {any} message - Notification object.
 * @param {Function} onRemove - Remove function.
 * @returns {ReactElement}
 */
function makeNotification(key: SnackbarKey, message: any, onRemove: Function) {
    const classes = makeClasses();
    const { t } = useTranslation();

    return (
        <SnackbarContent
            action={
                <IconButton onClick={() => onRemove(key)} size="small">
                    <CloseIcon htmlColor="white" />
                </IconButton>
            }
            message={
                <div>
                    <p className={classes.title}>{message.title || t(message.titleKey, message.titleArguments)}</p>
                    <div>
                        {typeof message === "string"
                            ? _getDescription({ descriptionKey: message }, t)
                            : _getDescription(message, t)}{" "}
                    </div>
                    {message.customActionNameKey?.length && message.customActionHandler?.length && (
                        <div className={classes.btnContainer}>
                            {message.customActionNameKey.map((customAction: string, customActionIndex: number) => (
                                <Button
                                    color="primary"
                                    key={customActionIndex}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClick={() => {
                                        if (message.customActionHandler[customActionIndex]()) {
                                            onRemove(key);
                                        }
                                    }}
                                    size="small"
                                    style={{ marginRight: 5 }}
                                    variant="outlined"
                                >
                                    {t(customAction)}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            }
        />
    );
}

/**
 * Set the new timer to the map.
 *
 * @param {number} timeout - Timeout to set.
 * @param {Function} onRemove - Action.
 * @param {string} uid - Notificaiton uid.
 * @returns {void}
 */
const setTimer = (timeout: number, onRemove: (id: any) => void, uid: string): void => {
    const timerID = timeout
        ? setTimeout(() => {
              onRemove(uid);
          }, timeout)
        : null;

    _timeouts.set(uid, timerID);
};

const useNotifier = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const notifications = useSelector((state: IReduxState) =>
        areThereNotifications(state) ? state["modules/base/notifications"].notifications : [],
    );

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onRemove = useCallback(
        (id) => {
            const to = _timeouts.get(id);

            if (to) {
                clearTimeout(to);
                _timeouts.delete(id);
            }

            closeSnackbar(id);
            dispatch(hideNotification(id));
        },
        [notifications],
    );

    const prevNotifications = useRef(notifications);

    useEffect(() => {
        if (_.isEqual(prevNotifications.current, notifications)) {
            return;
        }

        const prevNotificationsIds = prevNotifications.current.map(({ uid }) => uid) ?? [];

        prevNotificationsIds.forEach((id) => !notifications.some(({ uid }) => uid === id) && closeSnackbar(id));

        notifications.forEach((notification) => {
            const { props, uid, timeout } = notification;

            // if notification has a timeout and it's not already
            // present in timeouts, add it to timeouts and show.
            if (!_timeouts.has(uid)) {
                setTimer(timeout, onRemove, uid);

                // display snackbar using notistack
                enqueueSnackbar(props.title || t(props.titleKey ?? "", props.titleArguments), {
                    key: uid,
                    persist: true,
                    content: (key) => makeNotification(key, props, onRemove),
                });
            }
        });
        prevNotifications.current = notifications;
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
