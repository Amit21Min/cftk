import React, { useEffect, useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../ReusableComponents/RouteModels/routes';
import { Link } from 'react-router-dom'
import { Typography, Grid, TextField, Button, Toolbar, AppBar, Fab, List, ListItem, ListItemText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import {Card, CardActions, CardContent} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import {FullScreenDialog, GroupTable, CardHolders} from '../VolunteersPanel/components';
import * as ROUTES from '../../../constants/routes';
import db from '../../FirebaseComponents/Firebase/firebase.js';

import { lighten, makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    //marginLeft:'200',
    alignItems: 'left',
    margin: '0',
    width: '100%'
  },

  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 200px)`,
      marginLeft: 200,
      height: 88
    }
  },
  button: {
    display: 'flex',
    //marginLeft:'200',
    alignItems: 'right',
    margin: '0',
    width: '100%'
 

  },
  pageContainer: {

    height: '100%',
    width: '100%',
    marginLeft: '200',
    display: 'flex',
    //justifyContent: 'center',
    // alignItems: 'center',
    //flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 200px)`,
      marginLeft: 200,
    },
  },
  fab: {
    marginTop: '2rem',
    //marginLeft: '90%',
    alignItems: 'right',

  },
  dialog: {
    margin: 'auto'
  },
  input: {
   
  }, 
  grid: {
    flexGrow: 1,
  },
  
}));

const options = [
  'Create Group',
  'Import CSV'
];


const VolunteersPanel = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [questopen, setQuestOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [formDialog, setFormDialog] = useState(false);
  const onOpen = () => setOpen(true);
  const [clicked, setClicked] = useState(false);

  const [groups, setGroups] = React.useState([]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };


  const handleMenuItemClick = (event, index) => {
    console.log("clicked")

    //setSelectedIndex(index);
    //setAnchorEl(null);
  };

  const handleClick = () => {
    setOpenDialog(true);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  

  return (
    <div className={classes.root}> 


      <div>
        
        <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>Volunteer Groups</Typography></div>
        
        <br/>


        <div>
          <CardHolders></CardHolders>
        </div>

        <br/>

        <div className={classes.button}> 
          <FullScreenDialog></FullScreenDialog>
          <Button color="secondary" variant = "outlined"> Import CSV </Button>
        </div>

        <div>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <SearchOutlinedIcon />
          </Grid>
          <Grid item>
            <TextField id="input-with-icon-grid" label="Search Group" />
          </Grid>
        </Grid>
          <GroupTable></GroupTable>
        </div>
      </div>
      

    </div>


  );

};



export default VolunteersPanel;
