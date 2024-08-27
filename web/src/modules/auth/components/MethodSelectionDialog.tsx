import { ReactNode } from "react";

import { Button, Grid, Theme, Typography, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import FingerTouchIcon from "@components/FingerTouchIcon";
import PushNotificationIcon from "@components/PushNotificationIcon";
import TimerIcon from "@components/TimerIcon";
import { SecondFactorMethod } from "@models/Methods";
import { handleMethodSelected } from "@root/modules/auth/actions";
import Dialog from "@root/modules/base/dialog/components/Dialog";
import { IReduxState } from "@root/modules/base/redux/types";

const MethodSelectionDialog: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { t: translate } = useTranslation();
    const availableMethods = useSelector((state: IReduxState) => state["modules/config"].availableMethods);
    const webAuthnSupported = useSelector((state: IReduxState) => state["modules/auth"].webAuthnSupported);

    const pieChartIcon = (
        <TimerIcon width={24} height={24} period={15} color={theme.palette.primary.main} backgroundColor={"white"} />
    );

    return (
        <Dialog
        // actions={
        //     <Button color="primary" onClick={props.onClose}>
        //         {translate("Close")}
        //     </Button>
        // }
        >
            <Grid container justifyContent="center" spacing={1} id="methods-dialog">
                {availableMethods.includes(SecondFactorMethod.TOTP) ? (
                    <MethodItem
                        id="one-time-password-option"
                        method={translate("Time-based One-Time Password")}
                        icon={pieChartIcon}
                        onClick={() => dispatch(handleMethodSelected(SecondFactorMethod.TOTP))}
                    />
                ) : null}
                {availableMethods.includes(SecondFactorMethod.WebAuthn) && webAuthnSupported ? (
                    <MethodItem
                        id="webauthn-option"
                        method={translate("Security Key - WebAuthn")}
                        icon={<FingerTouchIcon size={32} />}
                        onClick={() => dispatch(handleMethodSelected(SecondFactorMethod.WebAuthn))}
                    />
                ) : null}
                {availableMethods.includes(SecondFactorMethod.MobilePush) ? (
                    <MethodItem
                        id="push-notification-option"
                        method={translate("Push Notification")}
                        icon={<PushNotificationIcon width={32} height={32} />}
                        onClick={() => dispatch(handleMethodSelected(SecondFactorMethod.MobilePush))}
                    />
                ) : null}
            </Grid>
        </Dialog>
    );
};

export default MethodSelectionDialog;

interface MethodItemProps {
    id: string;
    method: string;
    icon: ReactNode;

    onClick: () => void;
}

function MethodItem(props: MethodItemProps) {
    const style = makeStyles((theme: Theme) => ({
        item: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
            width: "100%",
        },
        icon: {
            display: "inline-block",
            fill: "white",
        },
        buttonRoot: {
            display: "block",
        },
    }))();

    return (
        <Grid item xs={12} className="method-option" id={props.id}>
            <Button
                className={style.item}
                color="primary"
                classes={{ root: style.buttonRoot }}
                variant="contained"
                onClick={props.onClick}
            >
                <div className={style.icon}>{props.icon}</div>
                <div>
                    <Typography>{props.method}</Typography>
                </div>
            </Button>
        </Grid>
    );
}
