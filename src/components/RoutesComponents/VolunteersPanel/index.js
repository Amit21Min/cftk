import React, { useEffect, useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../ReusableComponents/RouteModels/routes';
import { Link } from 'react-router-dom'
import { Typography, Grid, TextField, Button, Toolbar, AppBar, Fab, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add'

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Add from '@material-ui/icons/Add';
import Map from '../Map';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TrainRounded } from '@material-ui/icons';
import ImportCSVDialog from '../VolunteersPanel/dialog';

import {FullScreenDialog, AddMemberDialog} from '../VolunteersPanel/newgroup';
import * as ROUTES from '../../../constants/routes';

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
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 200px)`,
      marginLeft: 200,
      height: 88
    }
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
   
  }
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
  const [clicked, setClicked] = useState(false)

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

  

  return (
    <div className={classes.root}>
      <div>
        {/* <AppBar className={classes.appBar} position='fixed' color='transparent'>
          <Toolbar>
            <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: 'auto' }}>Volunteer Groups</Typography>
          </Toolbar>
        </AppBar> */}

        <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>Volunteer Groups</Typography></div>
        <FullScreenDialog></FullScreenDialog>
        <br/>
        
        
      </div>
      <br />

      <div>
        <Grid container spacing={2}>
          <Grid>
            <Card>

            </Card>
          </Grid>
          
        </Grid>
      </div>
    
      <div className={classes.fab}>
        <Fab ref={anchorRef} color="primary" aria-label='add' aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}>
          <AddIcon />
          <Popper align='left' open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <List onKeyDown={handleListKeyDown}>
                      <ListItem onClick={handleClick} button>
                        <ListItemText primary="Custom Group" />
                      </ListItem>
                      <ListItem onClick={(event) => handleMenuItemClick(event)} button>
                        <ListItemText>Import CSV</ListItemText>
                        {/*<Dialog disableBackdropClick disableEscapeKeyDown aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}
                          open={open} onClose={handleClose}>
                          <ImportCSVDialog close={handleClose} />
            </Dialog>*/}
                      </ListItem>
                    </List>

                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Fab>
      </div>


    </div >

  );

};



export default VolunteersPanel;
