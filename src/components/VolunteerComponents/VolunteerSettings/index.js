import React, { useState, useEffect } from 'react';
import { Button, TextField, Switch, withStyles } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import "../VolunteerSettings/index.css";
import NavBar from "../VolunteerNavBar/index.js";
import { auth, db } from "../../FirebaseComponents/Firebase/firebase"; // use auth using userID
import firebase from 'firebase';


const App = () => {

    const [textState, setTextState] = React.useState(true);
    const [emailState, setEmailState] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async function (user) {
          if (user) {
            fetchEmail(auth.currentUser.uid);
            fetchFName(auth.currentUser.uid);
            fetchLName(auth.currentUser.uid);
            fetchPhone(auth.currentUser.uid);
          }
        });
    });

    const handleTextChange = () => {
        setTextState(!textState);
    };

    const handleEmailChange = () => {
        setEmailState(!emailState);
    }   

    const fetchEmail = async function(uid) {   
        let userRef = db.collection('User').doc(uid); // need to update with volunteer ID rather than hardcode
        let userDoc = await userRef.get();
        setUserEmail(userDoc.data().email);
    }

    const fetchFName = async function(uid) {
        let userRef = db.collection('User').doc(uid); // need to update with volunteer ID rather than hardcode
        let userDoc = await userRef.get();
        setFirstName(userDoc.data().firstName);
    }

    const fetchLName = async function(uid) {
        let userRef = db.collection('User').doc(uid); // need to update with volunteer ID rather than hardcode
        let userDoc = await userRef.get();
        setLastName(userDoc.data().lastName);
    }

    const fetchPhone = async function(uid) {
        let userRef = db.collection('User').doc(uid); // need to update with volunteer ID rather than hardcode
        let userDoc = await userRef.get();
        setPhone(userDoc.data().phone);
    }

    const SignOutButton = withStyles({
        root: {
          marginTop: '15px',
          background: '#E5E5E5',
          color: '#0075A3',
          borderRadius: '32px',
          fontSize: '14px',
          lineHeight: '19px',
          fontWeight: '300',
          width: '184px',
          height: '48px',
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
          '&:hover': {
            background: '#0075A3',
            color: 'white',
          }
        }
      })(Button);

    return (

        <div className="main-container">
            <div className="vol-settings-content-container">
                <div className="contact-container">
                    <h4 className="title-text">Contact Information</h4>
                    <form className="this-form">
                        <div className="text-boxes">
                            <TextField id="filled-helperText-1" label="First name" value={firstName} variant="filled" margin="normal" fullWidth={true}/>
                        </div>
                        <div className="text-boxes">
                            <TextField id="filled-helperText-2" label="Last name" value={lastName} variant="filled" margin="normal" fullWidth={true}/>
                        </div>
                        <div className="text-boxes">
                            <TextField id="filled-helperText-3" label="Email address" value={userEmail} helperText="Others will not be able to see this." variant="filled" margin="normal" fullWidth={true}/>
                        </div>
                        <div className="text-boxes">
                        <TextField id="filled-helperText-4" label="Phone number" value={phone} helperText="Others will not be able to see this." variant="filled" margin="normal" fullWidth={true}/>
                        </div>
                    </form>
                </div>
                <div className="notification-container">
                    <h4 className="title-text">Notifications</h4>
                    <div className="phone-notifs">
                        <div className="icon"><PhoneIcon fontSize="large"></PhoneIcon></div>
                        <div className="details">
                            <h3>Get SMS notifications</h3>
                            <p className="description">When someeone sends you a new message</p>
                        </div>
                        <div className="switch"><Switch color="primary" checked={textState} onChange={handleTextChange}></Switch></div>
                    </div>
                    <div className="email-notifs">
                        <div className="icon"><MailIcon fontSize="large"></MailIcon></div>
                        <div className="details">
                            <h3>Get email notifications</h3>
                            <p className="description">When someone sends you a new message</p>
                        </div>
                        <div className="switch"><Switch color="primary" checked={emailState} onChange={handleEmailChange}></Switch></div>
                    </div>
                </div>

                <SignOutButton>Sign Out</SignOutButton>                
            </div>
            
            <NavBar tab="settings" />
            
        </div>
    );
}

export default App;