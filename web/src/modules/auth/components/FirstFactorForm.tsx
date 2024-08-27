import React, { useCallback, useEffect, useRef } from "react";

import {
    Alert,
    AlertTitle,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import LoginLayout from "@layouts/LoginLayout";
import { passwordChanged, rememberMeChanged, signIn, usernameChanged } from "@root/modules/auth/actions";
import { appNavigate } from "@root/modules/base/app/actions";
import { IReduxState } from "@root/modules/base/redux/types";

const FirstFactorForm: React.FC = () => {
    const { t: translate } = useTranslation();
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const styles = useStyles();

    const {
        disabled,
        rememberMe,
        username,
        password,
        usernameError,
        passwordError,
        passwordCapsLock,
        passwordCapsLockPartial,
    } = useSelector((state: IReduxState) => state["modules/auth"]);
    const { resetPassword, resetPasswordCustomURL } = useSelector((state: IReduxState) => state["modules/config"]);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => usernameRef.current?.focus(), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleSignIn = useCallback(() => {
        if (username && password) {
            dispatch(signIn(username, password, rememberMe));
        }
    }, [dispatch, username, password, rememberMe]);

    return (
        <LoginLayout id="first-factor-stage" title={translate("Sign in")}>
            <FormControl id={"form-login"}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={usernameRef}
                            id="username-textfield"
                            label={translate("Username")}
                            variant="outlined"
                            required
                            value={username}
                            error={usernameError}
                            disabled={disabled}
                            fullWidth
                            onChange={(e) => dispatch(usernameChanged(e.target.value))}
                            onFocus={() => dispatch(usernameChanged(""))}
                            autoCapitalize="none"
                            autoComplete="username"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={passwordRef}
                            id="password-textfield"
                            label={translate("Password")}
                            variant="outlined"
                            required
                            fullWidth
                            disabled={disabled}
                            value={password}
                            error={passwordError}
                            onChange={(e) => dispatch(passwordChanged(e.target.value))}
                            // onFocus={() => setPasswordError(false)}
                            type="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                    {passwordCapsLock ? (
                        <Grid item xs={12} marginX={2}>
                            <Alert severity={"warning"}>
                                <AlertTitle>{translate("Warning")}</AlertTitle>
                                {passwordCapsLockPartial
                                    ? translate("The password was partially entered with Caps Lock")
                                    : translate("The password was entered with Caps Lock")}
                            </Alert>
                        </Grid>
                    ) : null}
                    {rememberMe ? (
                        <Grid item xs={12} className={classnames(styles.actionRow)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="remember-checkbox"
                                        disabled={disabled}
                                        checked={rememberMe}
                                        onChange={() => dispatch(rememberMeChanged())}
                                        // onKeyDown={handleRememberMeKeyDown}
                                        value="rememberMe"
                                        color="primary"
                                    />
                                }
                                className={styles.rememberMe}
                                label={translate("Remember me")}
                            />
                        </Grid>
                    ) : null}
                    <Grid item xs={12}>
                        <Button
                            id="sign-in-button"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={disabled}
                            onClick={handleSignIn}
                        >
                            {translate("Sign in")}
                        </Button>
                    </Grid>
                    {resetPassword ? (
                        <Grid item xs={12} className={classnames(styles.actionRow, styles.flexEnd)}>
                            <Link
                                id="reset-password-button"
                                component="button"
                                onClick={() => dispatch(appNavigate(resetPasswordCustomURL))}
                                className={styles.resetLink}
                                underline="hover"
                            >
                                {translate("Reset password?")}
                            </Link>
                        </Grid>
                    ) : null}
                </Grid>
            </FormControl>
        </LoginLayout>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    actionRow: {
        display: "flex",
        flexDirection: "row",
        marginTop: theme.spacing(-1),
        marginBottom: theme.spacing(-1),
    },
    resetLink: {
        cursor: "pointer",
        paddingTop: 13.5,
        paddingBottom: 13.5,
    },
    rememberMe: {
        flexGrow: 1,
    },
    flexEnd: {
        justifyContent: "flex-end",
    },
}));

export default FirstFactorForm;
