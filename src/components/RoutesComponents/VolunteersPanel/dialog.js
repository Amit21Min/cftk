import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';



const ImportCSVDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [{fileName, isValidFile}, setFileName] = useState({
    fileName: "",
    isValidFile: true
  });
  
  const handleClose = () => {
    setOpen(false);
  };
  const handleFile = (e) => {
    setFileName({
      fileName: e.target.value,
      isValidName: e.target.value.length > 0
    });
  };
  const fileInput = React.useRef();
  
  return (
    <Box maxWidth="600px" style={{ padding: 10, margin: 20 }}>
        <h1 className="title"> Import CSV</h1>
        
        <TextField label="Import CSV" id='file' value={fileName} onChange={handleFile} 
          fullWidth
          variant="filled"
          size='small'
          autoFocus>
           
          </TextField>

        <div className='buttons' justify="flex-end">
        <Button color="primary" my={50} style={{ borderRadius: 50}} onClick={handleClose} > Cancel </Button>
        <Button color="primary" ml={50} style={{ borderRadius: 50}} onClick={handleClose} variant="contained"> Import </Button>
        </div>
    </Box>
  );
};



export default ImportCSVDialog;