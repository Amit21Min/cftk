import React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { db } from '../../FirebaseComponents/Firebase/firebase';
// https://www.npmjs.com/package/material-ui-chip-input
// npm i --save material-ui-chip-input@next
// import ChipInput from 'material-ui-chip-input' // not working well - hard to style

const AssignRoute = (props) => {
    const phone_helptext = "Enter a phone number, and press Enter to add it.";
    const email_helptext = "Enter an email address, and press Enter to add it.";
    const [group, setGroup] = React.useState("");
    const [phoneData, setPhoneData] = React.useState([]); // phone number list
    const [emailData, setEmailData] = React.useState([]); // email list
    // console.log(props.routes);

    //validations
    const [inputs, setInputs] = React.useState({
        copy: false,
        phone_error: false,
        phone_ht: phone_helptext,
        email_error: false,
        email_ht: email_helptext,
        complete: false
    });

    // helper function that gets all house numbers on a street, used for building the RoutesActive document
    const getHouses = (item_ids, callback) => {
        let itemRefs = item_ids.map(id => {
          return db.collection('Streets').doc(id).get();
        });

        Promise.all(itemRefs)
        .then(docs => {
          let items = docs.map(doc => doc.data());
          callback(items);
        })
        .catch(error => console.log(error))
      }
    // creates the document in RoutesActive
    const setActiveRoute = function(input, streets, houses, users, city) {
        var today = new Date();
        var routeHistory = {
            assignedTo : input.group,
            housesCompleted: 0,
            housesTotal: 0,
            streets: {},
            visitDate: String(parseInt(today.getMonth())+1) + '/' + today.getDate()  + '/' + today.getFullYear(),
            city: city
        }
        for (let i in streets) {
            var gatherHouses = [];
            let houseInfo = {
                donationAmt: null,
                learnMore: null,
                solicitation: null,
                volunteerComments: null
            };
            Object.keys(houses[i]).slice(0,-2).forEach(function(houseNumber) {
                routeHistory.housesTotal += 1;
                gatherHouses.push({
                    [houseNumber] : houseInfo
                });
            });
            routeHistory.streets[streets[i]] = gatherHouses;
        }
        const ref = db.collection('your_collection_name').doc();
        const id = ref.id;
        let routeUID = props.routes + '_' + id;

        const res = db.collection('RoutesActive').doc(routeUID).set(routeHistory);
        setGroupAssignment(input.group, routeUID);
        setRouteAssignment(input.routeID);

    };

    const setRouteAssignment = async function(routeID) {
        db.collection('Routes').doc(routeID).update({
            assignmentStatus: true
        })
    }

    const setGroupAssignment = async function(group, routeUID) {
        var groupRef = db.collection('Groups').doc(group);
        groupRef.update({
            assignment: routeUID
        })
    }
    
    // async func for fetching all streets within a route, then fetching all street information and building the route object to store in "routeHistory"
    const getStreets = async function(input) {
        const routeRef = db.collection('Routes').doc(input.routeID);
        const doc = await routeRef.get();
        const groupRef = db.collection('Groups').doc(input.group);
        const groupDoc = await groupRef.get();

        if (!doc.exists) {
            console.log('No such route found');
        } else if (!groupDoc.exists) {
            console.log('No such group name');
        } else {
            let city = doc.data().city;
            let streets = doc.data().streets;
            getHouses(streets, houses => setActiveRoute(input, streets, houses, "placeholder users", city)); // getHouses grabs all of the houses with a Promise.all -> when resolved, it callbacks to houses() to set the route as active
        }
    }

    //submit assign
    const assign = () => {
        let input = {
            routeID: props.routes,
            group: document.getElementById('group').value,
            link: document.getElementById('link').value,
            phone_numbers: phoneData,
            emails: emailData,
            message: document.getElementById('message').value,
        }
        getStreets(input);

        // TODO possibly change each user's 'assignment' status to the Route UID too, although it may not be necessary
    }

    const addGroup = () => {
        setGroup(document.getElementById('group').value);
    }

    const addPhone = () => {
        let textfield = document.getElementById('phone');
        let p = textfield.value.trim();
        p = p.replace(/\D/g, ''); // strip all non-digits
        if (p === "") { // validations
            return;
        } else if (phoneData.includes(p)) { // no duplicates
            setInputs(prevState => ({ ...prevState, phone_ht: 'Phone number already exists', phone_error: true }));
            return;
        } else if (p.toString().length != 10 || !p.match(/^[0-9]+$/)) { //!Number.isInteger(p)?
            setInputs(prevState => ({ ...prevState, phone_ht: 'Must be a 10-digit US phone number', phone_error: true }));
            return;
        }
        setPhoneData([...phoneData, p]); // add to list //?setPhoneData([phoneData.push(p)]);
        textfield.value = ""; // reset text field
    };

    const deletePhone = (data) => () => {
        setPhoneData((phoneData) => phoneData.filter((d) => d !== data));
    }

    const addEmail = () => {
        let textfield = document.getElementById('email');
        let p = textfield.value.trim();
        if (p === "") {
            return;
        } else if (emailData.includes(p)) {
            setInputs(prevState => ({ ...prevState, email_ht: "Email already exists", email_error: true }));
            return;
        } else if (!p.match(/\S+@\S+\.\S+/)) { // check email format
            setInputs(prevState => ({ ...prevState, email_ht: "This does not look like a valid email", email_error: true }));
            return;
        }
        setEmailData([...emailData, p]);
        textfield.value = "";
    };

    const deleteEmail = (data) => () => {
        setEmailData((emailData) => emailData.filter((d) => d !== data));
    }

    //copy link
    const copy = () => {
        let button = document.getElementById('link');
        button.select();
        document.execCommand('copy');
        setInputs(prevState => ({ ...prevState, copy: true }));
        setTimeout(
            (() => { setInputs(prevState => ({ ...prevState, copy: false })); }),
            500
        );
    };

    // phone number input check
    const phoneChange = (e) => {
        if (inputs.phone_error) { // if previous format is wrong, hide warnings on change
            setInputs(prevState => ({ ...prevState, phone_ht: phone_helptext, phone_error: false }));
        }
        let textfield = document.getElementById('phone');
        let p = textfield.value.trim();
        if (p.toString().length == 10 && p.match(/^[0-9]+$/)) { // correct phone format
            p = "(" + p.slice(0, 3) + ") " + p.slice(3, 6) + "-" + p.slice(6, 10); // format (123)456-7890
        } else {
            p = p.replace(/\D/g, ''); // delelte non-digits (only allow typing digits)
        }
        document.getElementById('phone').value = p; // set textarea value
    }

    const emailChange = (e) => {
        if (inputs.email_error) {
            setInputs(prevState => ({ ...prevState, email_ht: email_helptext, email_error: false }));
        }
        if (e.which == 13) {
            addEmail();
        }
    }

    return (
        <Box maxWidth="600px" style={{ padding: 10, margin: 20 }}>
            <h1 className="title">Assign {props.routes}
            {/* props.routes.length === 1 ? props.routes[0] : "Multiple Routes" */}
                <IconButton aria-label="close" style={{ float: "right", display: "inline" }} onClick={props.close}>
                    <CloseIcon />
                </IconButton></h1>

            {/* TODO: Group name - should be autocomplete here but not yet*/}
            <TextField
                id="group"
                label="Group Name"
                helperText="Choose an existing group from the volunteer database."
                fullWidth
                variant="filled"
                size='small'
                autoFocus
                onBlur={addGroup}
            />
            <br /><br />
            <div>
                <TextField
                    id="link"
                    label="Link"
                    defaultValue="www.cftkcanning.com/routes/example"
                    helperText="Link that anyone can access"
                    variant="filled"
                    InputProps={{
                        readOnly: true,
                    }}
                    size='small'
                    style={{ width: '83%' }}
                />
                <Button color="primary" style={{ float: "right" }} size="large" onClick={copy} disabled={inputs.copy}>
                    {inputs.copy ? "Copied!" : "COPY"}
                </Button>{/* TODO: Use a success snackbar within dialog to show copied successfully*/}
            </div>
            <br />
            <div>
                <TextField
                    id="phone"
                    label="Phone Number"
                    placeholder="1234567890"
                    variant="filled"
                    size='small'
                    fullWidth
                    helperText={inputs.phone_ht}
                    onChange={phoneChange}
                    onKeyDown={(e) => { if (e.which == 13) { addPhone(); } }}
                    error={inputs.phone_error}
                ></TextField>
                {/* <Button color="primary" size="large" onClick={addPhone}>ADD</Button> */}
                <Box> {/* TODO: Put chips into textarea*/}
                    {phoneData.map((data) => {
                        return (
                            <Chip
                                key={data}
                                label={data}
                                onDelete={deletePhone(data)}
                                //className={classes.chip}
                                color="primary"
                                style={{ margin: 2 }}
                            />
                        );
                    })}
                </Box>
            </div>
            <br />
            <div>
                <TextField
                    id="email"
                    label="Email"
                    placeholder="example@example.com"
                    helperText={inputs.email_ht}
                    variant="filled"
                    size='small'
                    fullWidth
                    error={inputs.email_error}
                    onKeyDown={emailChange}
                />
                {/* <Button color="primary" size="large" onClick={addEmail}>ADD</Button> */}
                <Box> {/* TODO: Put chips into textarea*/}
                    {emailData.map((data) => {
                        return (
                            <Chip
                                key={data}
                                label={data}
                                onDelete={deleteEmail(data)}
                                color="primary"
                                style={{ margin: 2 }}
                            />
                        );
                    })}
                </Box>
            </div>
            <br />
            <div>
                <TextField
                    id="message"
                    label="Message"
                    fullWidth
                    multiline
                    rowsMax={3}
                    rows={3}
                    variant="filled"
                />
            </div>
            <br />
            <Grid container justify="flex-end">
                <Button color="primary" my={50} style={{ borderRadius: 50 }} onClick={props.close}>CLOSE</Button>
                <p>&nbsp;&nbsp;&nbsp;</p>
                <Button variant="contained" ml={50} style={{ borderRadius: 50 }} color="primary"
                    onClick={function (event) { assign(); props.close(); }}
                    // disabled={(phoneData.length == 0 && emailData.length == 0) || group === ""}
                    >
                    ASSIGN</Button>
            </Grid>
        </Box>

    );

};

export default AssignRoute;