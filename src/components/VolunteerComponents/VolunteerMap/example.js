import React, { useState, useEffect } from 'react';
import VolunteerNavBar from '../VolunteerNavBar';
import MobileMap from '../../RoutesComponents/Map/mobileMap';
import { Paper, ClickAwayListener, Typography, Divider } from '@material-ui/core';
import { auth } from '../../FirebaseComponents/Firebase/firebase';
import { getAssignedRoute } from '../../RoutesComponents/ReusableComponents/RouteModels/routes';
import firebase from 'firebase';

function ExampleMap() {

    // let styleExample = {

    // }
    const [assignedRoute, setAssignedRoute] = useState("");
    const [addressData, setAddressData] = useState({});
    const [slide, setSlide] = useState({
        top: '100vh',
        transition: 'all 1s'
    })

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // The code is in routes.js in RouteModels
                getAssignedRoute(auth.currentUser.uid).then(route => {
                    setAssignedRoute(route ?? '');
                })
            }
        });
        return function cleanup() {
            unsubscribe();
        }
    }, []);

    function handleIconClick(addressData) {
        // addressData is an object with 3 fields: key, street, city
        // key holds the house number
        // street holds the street name
        // city holds the city name
        // comments holds the first 2 comments
        // complete holds whether the address has been completed
        // donation holds the donation amount, otherwise the text: "Not Yet Donated"
        // solicitation holds true/false for

        // This example function makes it so that when you click a house Icon, you trigger something
        console.log(addressData);
        setAddressData(addressData);
        // Hack to push to back of execution cycle
        setTimeout(() => {
            setSlide({
                top: 'calc(100vh - 250px)',
                transition: 'all 1s'
            })
        }, 50)
    }

    function handleHeaderClick() {
        setSlide({
            top: 'calc(100vh - calc(100vh - 200px))',
            transition: 'all 1s'
        })
    }

    function handleClickAway() {
        if (slide.top === '100vh') return
        setSlide({
            top: '100vh',
            transition: 'all 1s'
        })
    }

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <MobileMap width={'100%'} height={'calc(100vh - 72px)'} innerStyle={slide} assignedRoute={assignedRoute} onClickIcon={handleIconClick}>
                {/* To put a component on top of the map, put it inside the MobileMap component. The innerStyle prop allows for limited styling of inner component */}
                {/* You can use the absolute positioning to position the element within the map relative to the map itself */}
                <ClickAwayListener
                    onClickAway={handleClickAway} >
                    <Paper style={{ width: '100vw', height: '100vh', padding: '10px' }}>
                        {/* This top div is revealed in the first stage */}
                        <div style={{ height: '178px', cursor: 'pointer' }} onClick={handleHeaderClick}>
                            <div style={{ display: 'flex' }}>
                                {/* Title */}
                                <Typography variant="h5">
                                    {`${addressData.key ?? ''} ${addressData.street}`}
                                </Typography>
                                {/* Complete/Incomplete text */}
                                <Typography variant="h6" style={{ marginLeft: 'auto', marginRight: '10px', color: addressData.complete ? 'green' : 'lightgrey' }}>
                                    {addressData.complete ? 'Complete' : 'Incomplete'}
                                </Typography>
                            </div>
                            <div>
                                {/* List of summary data */}
                                <ul style={{ listStyle: 'inherit', paddingLeft: '20px' }}>
                                    <li>{addressData.solicitation}</li>
                                    <li>Donated: {addressData.donation}</li>
                                    {addressData.comments?.map(comment => (
                                        <li>{comment}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Divider></Divider>
                        {/* This bottom most div is revealed in the second stage */}
                        <div>
                            We're no strangers to love;
                            You know the rules and so do I;
                            A full commitment's what I'm thinking of;
                            You wouldn't get this from any other guy;

                            I just wanna tell you how I'm feeling;
                            Gotta make you understand;

                            Never gonna give you up;
                            Never gonna let you down;
                            Never gonna run around and desert you;
                            Never gonna make you cry;
                            Never gonna say goodbye;
                            Never gonna tell a lie and hurt you;
                        </div>
                    </Paper>
                </ClickAwayListener>
            </MobileMap>
            <VolunteerNavBar tab="route-map"></VolunteerNavBar>
            {/* This is just a dialog to show that clicking an icon can open something */}
        </div>
    )
}

export default ExampleMap;