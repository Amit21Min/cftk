import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import RestoreIcon from '@material-ui/icons/Restore'
import SettingsIcon from '@material-ui/icons/Settings';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MessageIcon from '@material-ui/icons/Message';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const useStyles = makeStyles({
root: {
    width: 800,
    backgroundColor:"#E0E0E0",
  
    }
})




function App(){
    const classes = useStyles()
    const [value, setValue] = React.useState(0)
    const handleChange = (event, newValue) =>  {
        setValue(newValue)
    }
    return (
    <div>
        <BottomNavigation
         className = {classes.root}
         value = {value}
         onChange = {(event, newValue) => handleChange(event,newValue)}  >

        <BottomNavigationAction label = 'Progress 'icon = {<TrendingUpIcon/>} /> 
        <BottomNavigationAction label = "Messages" icon = {<MessageIcon/>} />  
        <BottomNavigationAction label = 'Settings'icon = {<SettingsIcon/>} /> 
        
        </BottomNavigation>
    </div>
);
}

export default App;