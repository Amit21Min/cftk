import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import PillButton from '../PillButton';
// import PropTypes from 'prop-types';


const GroupedTextField = (props) => {

  return (
    <Grid container spacing={1}>
      <Grid item xs={10}>
        <TextField
          fullWidth variant="filled" error={props.error}
          label={props.label}
          value={props.fieldValue}
          onChange={props.onChange}
        />
      </Grid>
      <Grid item xs={2}>
        <PillButton color={props.buttonColor}
          onClick={props.onButtonClick}
          disabled={props.fieldValue.length === 0}
          style={{ height: "100%", width: "100%", borderRadius: '5em' }}
        >
          {props.buttonLabel}
        </PillButton>
      </Grid>
    </Grid>
  );
};

// GroupedTextField.propTypes = {
//   error: PropTypes.bool,
//   label: PropTypes.node,
//   fieldValue: PropTypes.node, // Anything renderable by react, but in most cases a string
//   onChange: PropTypes.func,
//   buttonColor: PropTypes.oneOf(['primary', 'secondary', 'default']),
//   onClick: PropTypes.func,
//   buttonLabel: PropTypes.node // Anything renderable by react, but in most cases a string
// }

export default GroupedTextField;
