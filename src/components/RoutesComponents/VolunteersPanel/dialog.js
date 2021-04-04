import React, { useEffect, useState } from 'react';
import db from '../../FirebaseComponents/Firebase/firebase.js';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    
  },
}));

const ImportCSVDialog = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [{ fileName, isValidFile }, setFileName] = useState({
    fileName: "",
    isValidFile: true
  });


  const handleClose = () => {
    setOpen(false);
  };
  
  const fileInput = React.useRef();

  

  const onChange = (e) => {
    console.log('from change');
    this.setState({
      uploadedFile: e.target.files[0]
    });
  };

  const routes = db.collection('GroupFiles');
  var exName='G20';
  const fileUpload = (e) => {
    console.log('import clicked')
    db.collection('GroupFiles').doc(exName).set(
      {docName: exName}
    );
  };

  return (
    <Box maxWidth="600px" style={{ padding: 10, margin: 20 }}>
      <h1 className="title"> Import CSV</h1>
      <div className='importfile'>
        <input
          type="file"
          className="custom-file-input"
          id="inputGroupFile01"
          aria-describedby="inputGroupFileAddon01"
          onChange={onChange}
          
        />
      </div>
      
      <br />

      <div className='buttons' justify="flex-end">
        <Button color="primary" my={50} style={{ borderRadius: 50 }} onClick={handleClose} > Cancel </Button>
        <Button color="primary" ml={50} style={{ borderRadius: 50 }} onClick={fileUpload} variant="contained"> Import </Button>
      </div>

      

    </Box>
  );
};



export default ImportCSVDialog;