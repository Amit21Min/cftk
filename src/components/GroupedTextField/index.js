import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';


const GroupedTextField = (props) => {

  return (
    <Grid container spacing={3}>
      <Grid item xs={10}>
        <TextField
          fullWidth variant="filled" error={props.error}
          label={props.label}
          value={props.fieldValue}
          onChange={(e) => props.onFieldChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <Button fullWidth style={{ height: "100%", width: "100%", borderRadius: '5em' }} color={props.buttonColor}
          onClick={props.onButtonClick}
          disabled={props.fieldValue.length === 0}
        >
          {props.buttonLabel}
        </Button>
      </Grid>
    </Grid>
  );
};

export default GroupedTextField;
