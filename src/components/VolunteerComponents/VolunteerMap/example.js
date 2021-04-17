import React, { useState, useEffect } from 'react';
import VolunteerNavBar from '../VolunteerNavBar';
import MobileMap from '../../RoutesComponents/Map/mobileMap';
import { Paper, ClickAwayListener, Typography, Divider } from '@material-ui/core';
import { db, auth } from '../../FirebaseComponents/Firebase/firebase';
import firebase from 'firebase';

function ExampleMap() {

    // let styleExample = {

    // }
    const [groupID, setGroupID] = useState("");
    const [addressData, setAddressData] = useState({});
    const [styleExample, setStyleExample] = useState({
        top: '100vh',
        transition: 'all 1s'
    })

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                const userRef = db.collection('User').doc(auth.currentUser.uid);
                // const userRef = db.collection('User').doc("HSb6gOQ9zFSu242i4uCgifiE1Tq1");
                const userDoc = await userRef.get();
                const assignment = userDoc.exists ? userDoc.data().assignment : '';
                const groupDoc = await db.collection('Groups').where('assignment', '==', `${assignment}`).get();
                if (groupDoc.exists && groupDoc.id) {
                    setGroupID(`${groupDoc.id}`);
                }
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

        // This example function makes it so that when you click a house Icon, you trigger something
        console.log(addressData);
        setAddressData(addressData);
        // Hack to push to back of cycle
        setTimeout(() => {
            setStyleExample({
                top: 'calc(100vh - 250px)',
                transition: 'all 1s'
            })
        }, 50)
    }

    function handleHeaderClick() {
        setStyleExample({
            top: 'calc(100vh - 500px)',
            transition: 'all 1s'
        })
    }

    function handleClickAway() {
        if (styleExample.top === '100vh') return
        setStyleExample({
            top: '100vh',
            transition: 'all 1s'
        })
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>

            <MobileMap width={'100%'} height={'calc(100vh - 72px)'} innerStyle={styleExample} groupID={groupID} onClickIcon={handleIconClick}>
                {/* To put a component on top of the map, put it inside the MobileMap component. The innerStyle prop allows for limited styling of inner component */}
                {/* You can use the absolute positioning to position the element within the map relative to the map itself */}
                <ClickAwayListener
                    onClickAway={handleClickAway} >
                    <Paper style={{ width: '100vw', height: '100vh', padding: '10px' }}>
                        <div style={{ height: '178px', cursor: 'pointer' }} onClick={handleHeaderClick}>
                            <Typography variant="h5">
                                {`${addressData.key ?? ''} ${addressData.street}, ${addressData.city ?? ''}`}
                            </Typography>
                            <div>
                                <ul style={{listStyle: 'inherit', paddingLeft: '20px'}}>
                                    <li>{addressData.solicitation}</li>
                                    <li>Donated: {addressData.donation}</li>
                                    {addressData.comments?.map(comment => (
                                        <li>{comment}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Divider></Divider>
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