import React from 'react';
import { Button } from '@material-ui/core';


const PillButton = (props) => {

    let style = { height: "100%", width: "100%", borderRadius: '5em' }
    if (props.style != null) style = props.style
    // Styled button that looks like the material ui pill button
    return (
        <Button style={style}
            className={props.className}
            variant={props.variant}
            color={props.color}
            onClick={props.onClick}
            disabled={props.disabled}>
            {props.children}
        </Button>
    );
};

export default PillButton;
