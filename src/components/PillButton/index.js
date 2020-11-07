import React from 'react';
import { Button } from '@material-ui/core';


const PillButton = (props) => {

    // Styled button that looks like the material ui pill button
    return (
        <Button style={{ height: "100%", width: "100%", borderRadius: '5em' }} variant={props.variant} color={props.color} onClick={props.onClick} disabled={props.disabled}>
            Save
        </Button>
    );
};

export default PillButton;
