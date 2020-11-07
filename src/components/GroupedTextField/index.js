import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import PillButton from '../PillButton';


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
        >
          {props.buttonLabel}
        </PillButton>
      </Grid>
    </Grid>
  );
};

export default GroupedTextField;
