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
      <CircularProgress  variant="determinate" size="250px"{...props} />
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
              style = {{ fontSize: 36, fontWeight: "bold", fontColor: "black"}}>{`${props.value}/${props.totalHouses} `}
          </Typography>    
          <Typography style = {{ fontSize: 14, fontWeight: "bold", fontColor: "black"}}> Houses Visited</Typography>      
      </Grid>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic(props) {
  let progress = (props.numHouses/props.totalHouses) * 100;
  return <CircularProgressWithLabel value={progress} totalHouses={props.totalHouses} />;
}
