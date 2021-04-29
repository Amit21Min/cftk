import React from 'react';
// import PropTypes from 'prop-types'
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

// PillButton.propTypes = {
//     style: PropTypes.object,
//     className: PropTypes.string,
//     color: PropTypes.oneOf(['primary', 'secondary', 'default']),
//     onClick: PropTypes.func,
//     disabled: PropTypes.bool,
// }

export default PillButton;
