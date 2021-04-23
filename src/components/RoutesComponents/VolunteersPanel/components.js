import React, { useEffect, useState }  from 'react';
import {Button, Dialog, Checkbox, AppBar, Toolbar, IconButton, Typography, Slide, TextField, Paper, MenuItem,Menu} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Card, CardActions, CardContent} from '@material-ui/core';
//import { AddIcon, CloseIcon, EditIcon, DeleteIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon,MessageIcon,MailOutlineIcon}  from '@material-ui/icons';
import {DialogActions, DialogContent, DialogTitle, Switch, FormGroup, FormControlLabel, Grid, DialogContentText} from '@material-ui/core';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Collapse,TableFooter} from '@material-ui/core';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import EmailIcon from '@material-ui/icons/Email';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MessageIcon from '@material-ui/icons/Message';
import SpeakerNotesOffOutlinedIcon from '@material-ui/icons/SpeakerNotesOffOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import db from '../../FirebaseComponents/Firebase/firebase.js';
import { database } from 'firebase';
import AlertSnackbar from '../../ReusableComponents/AlertSnackbar';

//////////////////////////////////////////////////////////////////////////////////////////////////////////




export function CardHolders() {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);
  const [usersNotInGroup, setUsersNotInGroup] = React.useState([]);

  useEffect(() => {
    db.collection('User').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        const user=doc.data();
        user.id=doc.id;
        setUsers(prevState=> [...prevState,user]);
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })

    db.collection('Groups').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        const group=doc.data();
        group.id=doc.id;
        setData(prevState=> [...prevState,group]);
        //const result = group.users.every(val => users.includes(val));
        //setUsersNotInGroup(pre)
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })

    

  }, []);

  return (
    <Grid container spacing={1} alignItems="flex-end">
      <Grid item xs={3} mx='auto' my='auto'>
        <Card style={{backgroundColor:'#7CC9AA'}}>
          <CardContent>
            <Typography variant="h2"> {data.length} </Typography>
            <Typography variant="subtitle1"> Total Groups </Typography>
            
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3} mx='auto' my='auto'>
        <Card style={{backgroundColor:'#F78A72'}}>
          <CardContent>
            <Typography variant="h2"> {data.length} </Typography>
            <Typography variant="subtitle1"> Groups Without Assignment</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3} mx='auto' my='auto'>
        <Card style={{backgroundColor:'#BFBAFF'}}>
          <CardContent>
            <Typography variant="h2"> {users.length} </Typography>
            <Typography variant="subtitle1"> Total Volunteers </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3} mx='auto' my='auto'>
        <Card style={{backgroundColor:'#89D9E0'}}>
          <CardContent>
            <Typography variant="h2"> {users.length} </Typography>
            <Typography variant="subtitle1"> Ungrouped Volunteers </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////// styling //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  grid: {
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '25ch',
  },
  card: {
    height: '150',
    width: '150',
    margin: "left",
    alignContent: "center",
    marginLeft: theme.spacing(2),
    borderRadius: "2em",
    justifyContent:'center'
  },
  margin: {
    justify: 'center',

  },
  addButton: {
    margin: theme.spacing(1),
    borderRadius: "5em",
    paddingTop: '40'
  },
  labelAsterisk: {
    color: "#b71c1c"
  },
  table: {
    height:'100%',
    minWidth: '650',
    width: '100%'
  },


}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// NEW GROUP CUSTOM DIALOG //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// saves the new group to db collecitons
const newGroup = (groupName, idList) => {
  
  db.collection("Groups").doc(groupName).set({
    assignment: [],
    users: idList
  });
}



export function FullScreenDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [idList, setIdList] = React.useState([]);
  const [membersList, setMembers] = React.useState([]);
  const [id, setId] = React.useState('');
  const [clicked, setclicks] = React.useState(false);


  const Names = [
    { name: "Tina Smith", phone: '9190000001', email: 'email1@gm.com', id: '001' },
    { name: "Cameron Ackerman", phone: '9190000002', email: 'email2@gm.com', id: '002' },
    { name: "Daniel Smith", phone: '9190000003', email: 'email3@gm.com', id: '003' },
    { name: "Addison Thorton", phone: '9190000004', email: 'email4@gm.com', id: '004' },
    { name: "Laura Lawson", phone: '9190000005', email: 'email5@gm.com', id: '005' }
  ]

  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    db.collection('User').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        const user=doc.data();
        user.id=doc.id;
        setUsers(prevState=> [...prevState,user]);
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })


  }, []);
  
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSecondClickOpen = () =>{
    setSecondOpen(true);
  };

  const handleClose = () => {
    setMembers([]);
    setIdList([]);
    setOpen(false);
  };

  const handleSecondClose = () => {
    setSecondOpen(false);
  };
  const toggleChecked = () => {
    setChecked((prev) => !prev);
    console.log(checked);
  };

  const findId = (value) => {
    if (value !== '') {
      const idFound = users.find(o => o.firstName === value.split(' (')[0].split(' ')[0] && o.lastName===value.split(' (')[0].split(' ')[1]).id;
      console.log(idFound);
      setId(idFound);
      setEmail(users.find(o=>o.id===idFound).email);
      setPhone(users.find(o=>o.id===idFound).phone);
    } else {
      console.log('please select name');
      setId('');
    }

  }

  const saveMember = e => {
    const member={id: id, checked: checked, name: name, email: email, phone: phone}
    e.preventDefault()
    if (membersList.includes(member)) {
      alert("Please don't add an existing member");
      return;
    } else if (member === '') {
      alert("Please select a member to add");
      return;
    }
    console.log(id);
    console.log(checked);
    handleSecondClose();
    setMembers(prevState => [...prevState, member]);
    setIdList(prevState=> [...prevState, id]);    
  }

  const saveForm = e => {
    e.preventDefault()
    if (membersList.length==0) {
      handleClose();
    } else {
      newGroup(groupName,idList);
      handleClose();
      setMembers([]);
      setIdList([]);
      setUsers([]);
    }
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => {handleClickOpen(); }}>
        Create New Group
      </Button>
      <Dialog fullWidth={'lg'} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} color="primary">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              New Group
            </Typography>
            <Button autoFocus color="inherit" onClick={saveForm}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <br></br>
        <TextField required id="standard-required"
          className={classes.textField}
          label="Name" size="small"
          style={{ margin: 8 }}
          onChange={(e) => { setGroupName(e.target.value); }} />
        <TextField label="Description" />
        <br></br>
        
        <Grid container className={classes.grid} spacing={2}>
          
        <Grid item xs={3} mx='auto' my='auto'>
        <Card className={classes.card} style={{width:250, height: 250}}>
          <CardActions  style={{justifyContent: 'center'}}>
            <Button className={classes.addButton} aria-label="add" variant="outlined" color="primary" onClick={() => {handleSecondClickOpen();}}> 
              <AddIcon > </AddIcon>
            </Button>
            <Dialog fullWidth open={secondOpen}
              onClose={handleClose}
              TransitionComponent={Transition}
              style={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
              }}>
              <DialogTitle id="form-dialog-title">New Group Member</DialogTitle>
              <DialogContent>
                <Autocomplete
                  id="name-search"
                  options={users}
                  
                  getOptionSelected={(option, value) => option.firstName === value.firstName && option.lastName===value.lastName}
                  getOptionLabel={(option) => (option.firstName + ' ' + option.lastName + ' ' + '(' + option.email.split('@')[0] + ')')}
                  style={{ width: 300 }}
                  filterSelectedOptions
                  onInputChange={(event, newValue) => { setName(newValue.split(' (')[0].split(' ')[0]+' '+newValue.split(" (")[0].split(' ')[1]); findId(newValue);}}
                  renderInput={(params) => <TextField {...params} required label="Name" />}
                />

                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={checked} onChange={toggleChecked} color="primary" />}
                    label="Visible to other members"
                  />
                </FormGroup>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSecondClose} color="primary">
                  Cancel
                  </Button>
                <Button onClick={saveMember} color="primary">
                  Save
                  </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
          <CardContent>
            <Typography variant="h6" component="h2" align='center' style={{ color: "#bdbdbd"}}>
              Add new member
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {membersList.map(member => (
        <Grid item xs={3} mx='auto' my='auto' key = {member.id}>
        <Card className={classes.card} style={{width:250, height: 250}}>
          <CardContent>
            <Typography variant="h6" component="h2" align='center'>
                {member.name}
            </Typography>
            <Typography variant="subtitle1" component="h2" align='center'>
                {member.email}
            </Typography>
            <Typography variant="subtitle1" component="h2" align='center'>
                {member.phone}
            </Typography>
          </CardContent>
          <CardActions style={{justifyContent: 'center'}}>
            <Button>
              <EditIcon></EditIcon>
            </Button>
            <Button>
              <DeleteIcon></DeleteIcon>
            </Button>
          </CardActions>
          
        </Card>
      </Grid>
      ))}
      
      
      </Grid>
      </Dialog>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// GROUP TABLE COMPONENTS /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

////////// ROW COMPONENT //////////
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const [foundUsers, setUsers] = React.useState([]);


  useEffect(() => {
    async function getUsers() {db.collection('User').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        const user=doc.data();
        user.id=doc.id;
        console.log(user.lastName);
        if (row.users.find(o => o === user.id) === user.id) {
          setUsers(prevState=> [...prevState,user]);
        }
        //setIdList(prevState=> [...prevState,doc.id]);
        //console.log(user);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })}
    getUsers();

  }, []);


  /// aleart snack bar ///
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    severity: "",
    message: ""
  })
  
  function handleSnackBarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarState(prevState => ({
      ...prevState,
      open: false
    }));
  }
  const validationStates = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  }

  ///// end of alert snack bar
 
  const [checked, setChecked] = React.useState(false);
  const [userchecked, setCheckedUser] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleChangeUser=(event) => {
    setCheckedUser(event.target.checked);
  }

  //const [openMore,setOpenMore]=React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMore = Boolean(anchorEl);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };


  const handleEditClick =() => {
    handleMoreClose();
  }

  const [deleteDialog,setDeleteDialog] = React.useState(false);
  const handleDeleteClick = () => {
    handleMoreClose();
    setDeleteDialog(true);
  }

  const handleDeleteGroup = () => {
    const id=row.id
    function deleteGroup(id) {
      db.collection('Groups').doc(id).delete().then(() => {
        return {
          state:validationStates.SUCCESS,
          message:`${id} has been deleted successfully.`
        }
        
      }
      ).catch((error) => {
        return {
          state:validationStates.ERROR,
          message:`Error occurred when trying to delete ${id}.`
        }
       
      })

    }
    deleteGroup(id).then(msg=>{
      setSnackBarState({
        open: true,
        severity: msg.state.toLowerCase(),
        message: msg.message
      })
    });
    
    setDeleteDialog(false);
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell padding="checkbox"> 
            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
        </TableCell>
        <TableCell size = "small"> 
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
        <TableCell component="th" scope="row" align="right" size = "medium" >{row.id}</TableCell>
        <TableCell align="right" size = "medium">{row.users.length}</TableCell>
        <TableCell align="right" size = "medium">{row.assignment}</TableCell>
        <TableCell align="right" size = "small">
          <IconButton onClick={handleMoreClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu 
            anchorEl={anchorEl}
            keepMounted
            open={openMore}
            onClose={handleMoreClose}>
            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              <Dialog open = {deleteDialog} onClose = {() => setDeleteDialog(false)} >
                <DialogTitle id="form-dialog-title">Delete Group</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you want to delete group: {row.id}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setDeleteDialog(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleDeleteGroup} color="primary">
                  Delete
                </Button>
                </DialogActions>
              </Dialog>
          </Menu>
        </TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: "checkbox"}} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
           
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    
                    <TableCell>Name</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell align="right">Email Address</TableCell>
                    <TableCell align="right">Preferred Contact Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foundUsers.map((user) => (
                    
                    <TableRow key={user.id}>
                      <TableCell padding="checkbox"> 
                          
                          <Checkbox
                            checked={userchecked}
                            onChange={(event) => {
                              setCheckedUser(event.target.checked);
                            }}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                      </TableCell>
                      
                      <TableCell align="right"  size = "medium" >{user.firstName} {user.lastName}</TableCell>
                      <TableCell align="right" size = "medium"></TableCell>
                      <TableCell align="right"  size = "medium"></TableCell>
                      <TableCell align="right"  size = "medium" >{user.phone}</TableCell>
                      <TableCell align="right" size = "medium">{user.email}</TableCell>
                      <TableCell align="right" size = "small">{user.emailNotifications ? <EmailIcon color="primary"/> : <MailOutlineIcon color="#e0e0e0"/>} {user.sms ? <MessageIcon color="primary"/> : <SpeakerNotesOffOutlinedIcon color="#e0e0e0"/>} </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

          </Collapse>
        </TableCell>
      </TableRow>
    
    <AlertSnackbar
    open={snackBarState.open}
    severity={snackBarState.severity}
    autoHideDuration={6000}
    onClose={handleSnackBarClose}>
    {snackBarState.message}
    </AlertSnackbar>
    </React.Fragment>
  );
}

///////// ACTUAL TABLE ////////////////
Array.prototype.inArray = function(comparer) { 
  for(var i=0; i < this.length; i++) { 
      if(comparer(this[i])) return true; 
  }
  return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
  if (!this.inArray(comparer)) {
      this.push(element);
  }
}; 

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
////////////////////////
export const GroupTable = (props) => {
  const [data, setData] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    async function getGroups() {
      
      db.collection('Groups').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const group=doc.data();
        group.id=doc.id;
        //console.log(doc.id, " => ", doc.data());
        if (data.length >0) {
          data.pushIfNotExist(group,function(e) {
            return e.id === group.id
          })
        } else {
          setData(prevState=> [...prevState,group]);
        }
        
      
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })}
    getGroups();

  }, []);

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const columns = [
    {field: 'icon', headerName: "", width: 70},
    {field: 'name', headerName:'Name', width: 130},
    {field: 'number', headerName: 'Number of Volunteers', width: 100},
    {field: 'assigned', headerName: 'Route Assigned', width: 100},
    {field: 'phone', headerName: 'Phone Number', width: 130},
    {field: 'email', headerName: 'Email Address', width: 150},
    {field: 'preferred', headerName: 'Preferred Contact Method', width: 100}
  ]

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <div>
    <TableContainer component = {Paper}>
      <Table aria-label="collapsible table">
        {}
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"> 
            
            </TableCell>

            <TableCell size="small"/>
            <TableCell align="right"> Name </TableCell>
            <TableCell align="right"> Number of Volunteers </TableCell>
            <TableCell align="right"> Route Assigned </TableCell>
            <TableCell size="small"/>

          </TableRow>
        </TableHead>
        <TableBody>
        {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data).map((row) => (
            <Row key={row.id} row={row} />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>

    </TableContainer>


    
    </div>
    //<div style={{height: '100%', width:'100%',minWidth:'650'}}>
    //  <DataGrid  rows={data} columns={columns} pageSize={5} checkboxSelection />
    // </div>
  );
};

