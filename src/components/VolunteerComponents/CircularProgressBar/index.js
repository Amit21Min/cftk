import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import "../CircularProgressBar/index.css";


function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress  variant="determinate" size="250px" value={props.progress}/>
      <Box
        top={0}
        left={20}
        bottom={25}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
      <Grid>
        <Typography variant="subtitle1" component="div" 
              style = {{ fontSize: 36, fontWeight: "bold", fontColor: "black"}}>{`${props.housesCompleted}/${props.totalHouses} `}
          </Typography>    
          <Typography style = {{ fontSize: 14, fontWeight: "bold", fontColor: "black"}}> Houses Visited</Typography>      
      </Grid>
      </Box>
    </Box>
  );
}

export default function CircularStatic(props) {
  let progress = (props.housesCompleted/props.totalHouses) * 100;
  if (progress === undefined) {
    progress = 0;
  }
  if (props.housesCompleted === undefined) {
    props.housesCompleted = 0;
  }
  return <CircularProgressWithLabel progress={0} housesCompleted={props.housesCompleted} totalHouses={props.totalHouses} />;
}
