import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1
    },
    toolBar:  {
        color: 'black',
        backgroundColor: 'white',
        height: '88px',
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "29px",
        lineHeight: "32px"
    },
    appBar: {
        boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.08)"
    }
  }));
  

const TitleCard = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
          <AppBar position="static" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolBar}> {props.title}
            </Toolbar>
          </AppBar>
        </div>
      );

};

export default TitleCard;