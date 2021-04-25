import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
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
import { SettingsOverscanOutlined } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import db from '../../FirebaseComponents/Firebase/firebase.js';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
    borderRadius: "2em"
  },
  margin: {
    justify: 'center',

  },
  addButton: {
    margin: theme.spacing(1),
    borderRadius: "5em"
  },
  labelAsterisk: {
    color: "#b71c1c"
  }


}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const newGroup = (groupName, idList) => {
  
  db.collection("Groups").doc(groupName).set({
    assignment: null,
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
  const [validForm, setValidForm] = React.useState(false);

  const Names = [
    { name: "Tina Smith", phone: '9190000001', email: 'email1@gm.com', id: '001' },
    { name: "Cameron Ackerman", phone: '9190000002', email: 'email2@gm.com', id: '002' },
    { name: "Daniel Smith", phone: '9190000003', email: 'email3@gm.com', id: '003' },
    { name: "Addison Thorton", phone: '9190000004', email: 'email4@gm.com', id: '004' },
    { name: "Laura Lawson", phone: '9190000005', email: 'email5@gm.com', id: '005' }
  ]

  const [users, setUsers] = React.useState([]);
  
  const getUsers = () => {
    //const users = [];

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

    for (var i=0;i<users.length;i++) {
      console.log(users[i]);
    }
  
    //return ([]);
  }

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

  const validateForm = () => {
    if (membersList.length===0 | groupName.length===0){
      setValidForm(false);
    } else {
      setValidForm(true);
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(); getUsers();}}>
        Create New Group
      </Button>
      <Dialog fullWidth maxWidth='md' style={{height:'100%'}} open={open} onClose={handleClose} TransitionComponent={Transition}>
        
        <AppBar className={classes.appBar} color="secondary">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              New Group
            </Typography>
            <Button autoFocus variant='contained' color="inherit" onClick={saveForm} disabled={!validForm}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
        <br></br>
        <TextField required id="standard-required"
          className={classes.textField}
          label="Name" size="small"
          style={{ margin: 8 }}
          onChange={(e) => { setGroupName(e.target.value); }} onBlur={validateForm}/>
         
        <br></br>
        
        <Grid container className={classes.grid} spacing={2}>
          
        <Grid item xs={3} mx='auto' my='auto'>
        <Card className={classes.card} style={{width:200, height: 200}}>
          <CardActions className={classes.margin} jstyle={{justifyContent: 'center'}}>
            <Button className={classes.addButton} aria-label="add" variant="outlined" color="primary" onClick={() => {handleSecondClickOpen();}}> 
              <AddIcon></AddIcon>
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
                <Button onClick={saveMember} color="primary" onBlur={validateForm}>
                  Save
                  </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
          <CardContent>
            <Typography variant="h6" component="h2" align='center' style={{ color: "#bdbdbd", mx: "auto" }}>
              Add another member
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {membersList.map(member => (
        <Grid item xs={3} mx='auto' my='auto' key = {member.id}>
        <Card className={classes.card} style={{width:'200', height: '200'}}>
          <CardContent>
            <Typography variant="h6" component="p1" align='center'>
                {member.name}
            </Typography>
            <br/>
            <Typography variant="subtitle2" component="h3" align='center'>
                {member.email}
            </Typography>
            <br/>
            <Typography variant="subtitle2" component="h3" align='center'>
                {member.phone}
            </Typography>
          </CardContent>
          <CardActions>
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
      </DialogContent>
      </Dialog>
    </div>
  );
};




