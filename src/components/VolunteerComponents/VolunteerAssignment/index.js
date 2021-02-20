import React, { useState, setState } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import { Typography, Grid, CircularProgress, Chip, TextField, Button, FormControl, Select, InputLabel, BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import LabelBottomNavigation from '../BottomNavigationBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CircularProgressBar from '../CircularProgressBar';
  

const App = () => {
  const [numHousesCompleted, setNumHousesCompleted] = useState('');
  const [totalHouses, setTotalHouses] = useState('');
  const [state, setState] = useState({
    age: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12} justify="center"> 
        <Typography align="center" style = {{ fontSize: 32, fontWeight: "bold"}}>Volunteer Assignment</Typography>
      </Grid>  
      <Grid item xs={6} align="right">
          <CircularProgressBar numHouses="40" totalHouses="100"/>
      </Grid>
      <Grid item xs={6} justify="center">
        <FormControl>
          <InputLabel htmlFor="age-native-simple">Complete/Incomplete</InputLabel>
          <Select
            native
            onChange={handleChange}
            inputProps={{
              name: 'age',
              id: 'age-native-simple',
            }}
            style= {{minWidth: 200}}
          >
            <option aria-label="None"/>
            <option>Complete</option>
            <option>Incomplete</option>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} justify="center"> \
        <Typography align="center" style = {{ fontSize: 32, fontWeight: "bold"}}>Donation Leaderboard</Typography>
      </Grid>  
      <Grid item xs={8} spacing={3}justify="right">
        <Typography align="left" style = {{ fontSize: 16}}>May 13, 2021</Typography>
        <Typography align="left" style = {{ fontSize: 16}}>Last Updated: 5:06pm </Typography>
      </Grid>
      <Grid item xs={2} justify="right">
        <Typography align="left" style = {{ fontSize: 16}}>Your Team Rank: 0 </Typography>
      </Grid>
      <Grid item xs={12} justify="center">
        <Typography align="center" style = {{ fontSize: 20}}>No teams have collected any donations yet!</Typography>  
      </Grid>
      <Grid container spacing={0} direction="row" alignItems="center" justify="center">
        <LabelBottomNavigation />
      </Grid>
      
    </Grid>
  )
};
 
export default App;