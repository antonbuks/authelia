import React, { ReactNode } from "react";

import { Button, DialogActions, DialogContent, DialogTitle, Dialog as MuiDialog } from "@mui/material";
import { useDispatch } from "react-redux";

import { hideDialog } from "@root/modules/base/dialog/action";

interface GenericDialogProps extends React.PropsWithChildren {
    title?: string;
    actions?: ReactNode;
}

const Dialog: React.FC<GenericDialogProps> = ({ title, actions, children }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideDialog());
    };

    return (
        <MuiDialog open={true} onClose={handleClose}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {actions || (
                    <Button color="primary" onClick={handleClose}>
                        Close
                    </Button>
                )}
            </DialogActions>
        </MuiDialog>
    );
};

export default Dialog;
