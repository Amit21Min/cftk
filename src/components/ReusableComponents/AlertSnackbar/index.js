import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab'

function AlertSnackbar(props) {
    // Intakes 2 props, the severity
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity: "",
        message: "",
    });

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar(prevState => ({
            ...prevState,
            open: false
        }));
    }

    useEffect(() => {
        const isMessage = !!props.message && props.message.length > 0;
        setSnackBar({
            open: isMessage,
            severity: props.severity,
            message: isMessage ? props.message : ""
        })
    }, [props.chilren, props.severity]);

    return <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="filled" elevation={3} severity={snackBar.severity} onClose={handleClose} style={{ borderRadius: '5em'}}>
            {snackBar.message}
        </Alert>
    </Snackbar>
}

AlertSnackbar.propTypes = {
    severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    message: PropTypes.string
}

export default AlertSnackbar;