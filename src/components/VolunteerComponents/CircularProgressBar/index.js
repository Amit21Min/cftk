import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  box: {
    width: '100vw',
    height: '100vw',
    display: 'grid'
  },
  progress: {
    width: '100vw',
    height: '100vw',
    display: 'grid',
    placeItems: 'center',
    gridColumn: '1',
    gridRow: '1'
  },
  circle: {
    color: theme.palette.progressPrimary.main,
  },
  circleBack: {
    color: theme.palette.progressSecondary.main,
  },
  text: {
    width: '100vw',
    height: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gridColumn: '1',
    gridRow: '1'
  },
  progressBar: {
    backgroundColor: '#D7DBDD',
  }
}));


function CircularProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <div className={classes.box}>
      <div className={classes.progress}>
        <CircularProgress variant="static" size="250px" value={100} classes={{root: classes.circleBack}} />
      </div>
      <div className={classes.progress}>
        <CircularProgress variant="static" size="250px" value={props.progress} classes={{root: classes.circle}} />
      </div>
      {/* <div className={classes.progress}>
        <CircularProgress variant="determinate" size="250px" value={100} />
      </div> */}
      <div className={classes.text}>
        <Typography variant="subtitle1"
          style={{ fontSize: 36, fontWeight: "bold", fontColor: "black" }}>{`${props.housesCompleted}/${props.totalHouses} `}
        </Typography>
        <Typography style={{ fontSize: 14, fontWeight: "bold", fontColor: "black" }}>Houses Visited</Typography>
      </div>
    </div>
  );
}

export default function CircularStatic(props) {
  let progress = (props.housesCompleted / props.totalHouses) * 100;
  return <CircularProgressWithLabel progress={progress ?? 0} housesCompleted={props.housesCompleted ?? 0} totalHouses={props.totalHouses ?? 0} />;
}
