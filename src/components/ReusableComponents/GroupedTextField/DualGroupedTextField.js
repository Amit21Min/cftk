import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import PillButton from '../PillButton';
// import ChipList from '../ChipList';


const DualGroupedTextField = (props) => {

  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
        <TextField
          fullWidth variant="filled" error={props.error}
          style={{ height: "100%", width: "100%" }}
          label={props.label1}
          value={props.value1}
          onChange={props.onChange1}
          helperText={props.helperText1}
        // multiline
        // rows={Math.floor(props.list.length / 3)}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth variant="filled" error={props.error}
          style={{ height: "100%", width: "100%" }}
          label={props.label2}
          value={props.value2}
          onChange={props.onChange2}
          helperText={props.helperText2}
        // multiline
        // rows={Math.floor(props.list.length / 3)}
        // InputProps={ props.list.length > 0 ? {
        //   startAdornment: (
        //     <InputAdornment position="start">
        //       <ChipList list={props.list}></ChipList>
        //     </InputAdornment>
        //   ),
        // }: null}
        />
      </Grid>
      <Grid item xs={2}>
        <PillButton color={props.buttonColor}
          onClick={props.onButtonClick}
          style={{
            height: "56px",
            width: "100%",
            borderRadius: '5em'
          }}
          disabled={props.value1.length === 0 || props.value2.length === 0}
        >
          {props.buttonLabel}
        </PillButton>
      </Grid>
    </Grid>
  );
};

export default DualGroupedTextField;
