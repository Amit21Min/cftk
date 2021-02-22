import React from 'react';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ChatIcon from '@material-ui/icons/Chat';
import SettingsIcon from '@material-ui/icons/Settings';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import { Button, IconButton } from '@material-ui/core';
import "../VolunteerNavBar/index.css";


const NavBar = (props) => {

    const tab = props.tab;

    const selectedTab = () => {
        if (tab == "settings") {
            return (
                <div className="vol-nav-button-row">
                    <IconButton><TrendingUpIcon/></IconButton>
                    <IconButton><NearMeOutlinedIcon /></IconButton>
                    <IconButton><ChatIcon /></IconButton>
                    <div className="vol-nav-selected">
                        <IconButton><SettingsIcon color="primary"/></IconButton>
                        <p className="vol-nav-tab-text">SETTINGS</p>
                    </div>
                </div>
            );
        }
        else if (tab == "messages") {
            return (
                <div className="vol-nav-button-row">
                    <Button font-><TrendingUpIcon/></Button>
                    <Button><NearMeOutlinedIcon /></Button>
                    <div className="vol-nav-selected">
                        <Button><ChatIcon color="primary"/></Button>
                        <p className="vol-nav-tab-text">MESSAGES</p>
                    </div>
                    <Button><SettingsIcon/></Button>
                </div>
            );
        }

        else if (tab == "progress") {
            return (
                <div className="vol-nav-button-row">
                    <div className="vol-nav-selected">
                        <Button><TrendingUpIcon color="primary"/></Button>
                        <p className="vol-nav-tab-text">PROGRESS</p>
                    </div>
                    <Button><NearMeOutlinedIcon /></Button>
                    <Button><ChatIcon /></Button>
                    <Button><SettingsIcon/></Button>
                </div>
            );
        }

        else  {
            return (
                <div className="vol-nav-button-row">
                    <Button><TrendingUpIcon/></Button>
                    <div className="vol-nav-selected">
                        <Button><NearMeOutlinedIcon color="primary" /></Button>
                        <p className="vol-nav-tab-text">ROUTE MAP</p>
                    </div>
                    <Button><ChatIcon /></Button>
                    <Button><SettingsIcon/></Button>
                </div>
            );

        }
    }

    return (
        <div className="vol-nav-main">
            <div className="vol-nav-container">
                {selectedTab()}
               
            </div>
        </div>

    );

}

export default NavBar;