import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MessageIcon from '@material-ui/icons/Message';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SettingsIcon from '@material-ui/icons/Settings';
import NearMeIcon from '@material-ui/icons/NearMe';

const useStyles = makeStyles({
  root: {
    width: 500,
    backgroundColor: "#0075A3"
  },
  icon: {
      color: "white"
  },
});


export function getLabel(props) {
    return (
      <p style={{ color: "white" }}>{props}</p>
    )
  }

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label= {getLabel("Progress")} value="progress" icon={<TrendingUpIcon className={classes.icon} />} />
      <BottomNavigationAction label= {getLabel("Locate Myself")} value="locate" icon={<NearMeIcon className={classes.icon}/>} />
      <BottomNavigationAction label= {getLabel("Message")} value="message" icon={<MessageIcon className={classes.icon}/>} />
      <BottomNavigationAction label= {getLabel("Settings")} value="settings" icon={<SettingsIcon className={classes.icon}/>} />
    </BottomNavigation>
  );
}