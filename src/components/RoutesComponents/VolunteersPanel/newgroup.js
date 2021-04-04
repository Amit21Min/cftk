import React, { useEffect, useState }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import EmailIcon from '@material-ui/icons/Email';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import db from '../../FirebaseComponents/Firebase/firebase.js';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { DataUsageSharp, EmailOutlined } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import MessageIcon from '@material-ui/icons/Message';
import SpeakerNotesOffOutlinedIcon from '@material-ui/icons/SpeakerNotesOffOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

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
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
    db.collection('User').get().then((querySnapshot) => {
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
    })

  }, []);

 
  const [checked, setChecked] = React.useState(false);
  const [userchecked, setCheckedUser] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleChangeUser=(event) => {
    setCheckedUser(event.target.checked);
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
        <TableCell align="right" size = "medium"></TableCell>
        <TableCell align="right" size = "medium"></TableCell>
        <TableCell align="right" size = "small"></TableCell>
        
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
    </React.Fragment>
  );
}

///////// ACTUAL TABLE ////////////////

export const GroupTable = (props) => {
  const [data, setData] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    db.collection('Groups').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        const group=doc.data();
        group.id=doc.id;
        setData(prevState=> [...prevState,group]);
        //setIdList(prevState=> [...prevState,doc.id]);
      })
      
    })
    .catch(function (error) {
        console.log("error: ", error);
    })

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

  return (
    <TableContainer component = {Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"> 
            
            </TableCell>

            <TableCell size="small"/>
            <TableCell align="right"> Name </TableCell>
            <TableCell align="right"> Number of Volunteers </TableCell>
            <TableCell align="right"> Route Assigned </TableCell>
            <TableCell align="right"> Phone Number</TableCell>
            <TableCell align="right"> Email Address </TableCell>
            <TableCell align="right"> Preferred Contact Method </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>

    </TableContainer>

    //<div style={{height: '100%', width:'100%',minWidth:'650'}}>
    //  <DataGrid  rows={data} columns={columns} pageSize={5} checkboxSelection />
    // </div>
  );
};

