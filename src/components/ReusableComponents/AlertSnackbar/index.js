import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';


function AlertSnackbar(props) {
    // Combines the Snackbar and alert components together into one element and rounds the corners. Uses similar structure to default mui implementation

    // onClose Example
    // function handleClose(event, reason) {
        // if (reason === 'clickaway') {
        //     return;
        //   }
        // setOpen(false);
    // }

    return <Snackbar {...props}>
        <Alert variant="filled" elevation={3} style={{ borderRadius: '5em'}} {...props}>
            {props.children}
        </Alert>
    </Snackbar>
}

AlertSnackbar.propTypes = {
    open: PropTypes.bool,
    severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    children: PropTypes.string,
    onClose: PropTypes.func,
    autoHideDuration: PropTypes.number
}

export default AlertSnackbar;