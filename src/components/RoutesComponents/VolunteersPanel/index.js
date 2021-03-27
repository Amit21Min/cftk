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

import Card from '@material-ui/core/Card';

import {FullScreenDialog, AddMemberDialog} from '../VolunteersPanel/newgroup';
import * as ROUTES from '../../../constants/routes';
import db from '../../FirebaseComponents/Firebase/firebase.js';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

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
  table: {
    minWidth: 650,
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
  
  async function getGroups() {
    db.collection('Groupts').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const group=doc.data();
        group.id=doc.id;
        setGroups(prevState=> [...prevState,group]);
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })
    return;
  };

  getGroups();
  

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
        {/* <AppBar className={classes.appBar} position='fixed' color='transparent'>
          <Toolbar>
            <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: 'auto' }}>Volunteer Groups</Typography>
          </Toolbar>
        </AppBar> */}

        <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>Volunteer Groups</Typography></div>
        <div className={classes.button}> 
        <FullScreenDialog></FullScreenDialog>
        <Button color="secondary" variant = "outlined"> Import CSV </Button>
        </div>
        <br/>
        
        <Grid container spacing={2}>
          <Grid>
            <Card>

            </Card>
          </Grid>
          
        </Grid>
        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Groups Name</TableCell>
            <TableCell align="right">Assignment&nbsp;</TableCell>
            <TableCell align="right">Members&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.assignment}</TableCell>
              <TableCell align="right">{row.users}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      </div>
          
    </div >

  );

};



export default VolunteersPanel;
