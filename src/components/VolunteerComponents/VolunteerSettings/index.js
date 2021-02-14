import React from 'react';
import { Button, TextField, Switch, withStyles } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import "../VolunteerSettings/index.css";

const App = () => {

    const [textState, setTextState] = React.useState(true);
    const [emailState, setEmailState] = React.useState(false);
    const [firstName, setFirstName] = React.useState("Sameer");
    const [lastName, setLastName] = React.useState("Rao");

    const handleTextChange = () => {
        setTextState(!textState);
    };

    const handleEmailChange = () => {
        setEmailState(!emailState);
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
            <div className="content-container">
                <div className="contact-container">
                    <h4 className="title-text">Contact Information</h4>
                    <form className="this-form">
                        <div className="text-boxes">
                            <TextField id="filled-helperText" label="First name" defaultValue={firstName} variant="filled" margin="normal" fullWidth="true"/>
                        </div>
                        <div className="text-boxes">
                            <TextField id="filled-helperText" label="Last name" defaultValue={lastName} variant="filled" margin="normal" fullWidth="true"/>
                        </div>
                        <div className="text-boxes">
                            <TextField id="filled-helperText" label="Email address" defaultValue="john.doe@gmail.com" helperText="Others will not be able to see this." defaultValue="" variant="filled" margin="normal" fullWidth="true"/>
                        </div>
                        <div className="text-boxes">
                        <TextField id="filled-helperText" label="Phone number" defaultValue="(919) 342 - 3461" helperText="Others will not be able to see this." defaultValue="" variant="filled" margin="normal" fullWidth="true"/>
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
            
        </div>
    );
}

export default App;