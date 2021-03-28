import React from 'react';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ChatIcon from '@material-ui/icons/Chat';
import SettingsIcon from '@material-ui/icons/Settings';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import { Button } from '@material-ui/core';
import "../VolunteerNavBar/index.css";
import { indigo } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

/*======= When using the NavBar, use a tab prop with either 'settings', 'messages', 'progress'

or 'route-map' as its value. When using the NavBar, the parent element should be the full height.

I suggest using a container div and setting its height to 100vh.

========= */

const NavBar = (props) => {

    const tab = props.tab;

    const selectedTab = () => {
        if (tab === "settings") {
            return (
                <div className="vol-nav-button-row">
                    <Link to={ROUTES.VOLUNTEER_PROGRESS}>
                        <Button><TrendingUpIcon style={{color: indigo[50]}}></TrendingUpIcon></Button>
                    </Link>

                    <Link to={ROUTES.VOLUNTEER_MAP}>
                        <Button><NearMeOutlinedIcon style={{color: indigo[50]}}/></Button>
                    </Link>

                    <Link to={ROUTES.VOLUNTEER_MESSAGES}>
                        <Button><ChatIcon style={{color: indigo[50]}}/></Button>
                    </Link>
                    <div className="vol-nav-selected">
                        <Button><SettingsIcon color="primary"/></Button>
                        <p className="vol-nav-tab-text">SETTINGS</p>
                    </div>
                </div>
            );
        }
        else if (tab === "messages") {
            return (
                <div className="vol-nav-button-row">
                    <Link to={ROUTES.VOLUNTEER_PROGRESS}>
                        <Button><TrendingUpIcon style={{color: indigo[50]}}/></Button>
                    </Link>

                    <Link to={ROUTES.VOLUNTEER_MAP}>
                        <Button><NearMeOutlinedIcon style={{color: indigo[50]}}/></Button>
                    </Link>

                    <div className="vol-nav-selected">
                        <Button><ChatIcon color="primary"/></Button>
                        <p className="vol-nav-tab-text">MESSAGES</p>
                    </div>
                    <Link to={ROUTES.VOLUNTEER_SETTINGS}> 
                        <Button><SettingsIcon style={{color: indigo[50]}}/></Button>
                    </Link>
                </div>
            );
        }

        else if (tab === "progress") {
            return (
                <div className="vol-nav-button-row">
                    <div className="vol-nav-selected">
                        <Button><TrendingUpIcon color="primary"/></Button>
                        <p className="vol-nav-tab-text">PROGRESS</p>
                    </div>
                    <Link to={ROUTES.VOLUNTEER_MAP}>
                        <Button><NearMeOutlinedIcon style={{color: indigo[50]}} /></Button>
                    </Link>
                    <Link to={ROUTES.VOLUNTEER_MESSAGES}>
                        <Button><ChatIcon style={{color: indigo[50]}}/></Button>
                    </Link>
                    <Link to={ROUTES.VOLUNTEER_SETTINGS}>
                        <Button><SettingsIcon style={{color: indigo[50]}}/></Button>
                    </Link>
                </div>
            );
        }

        else if (tab === "route-map") {
            return (
                <div className="vol-nav-button-row">
                    <Link to={ROUTES.VOLUNTEER_PROGRESS}>
                        <Button><TrendingUpIcon style={{color: indigo[50]}}/></Button>
                    </Link>
                    <div className="vol-nav-selected">
                        <Button><NearMeOutlinedIcon color="primary" /></Button>
                        <p className="vol-nav-tab-text">ROUTE MAP</p>
                    </div>
                    <Link to={ROUTES.VOLUNTEER_MESSAGES}>
                        <Button><ChatIcon style={{color: indigo[50]}} /></Button>
                    </Link>
                    <Link to={ROUTES.VOLUNTEER_SETTINGS}>
                        <Button><SettingsIcon style={{color: indigo[50]}}/></Button>
                    </Link>
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