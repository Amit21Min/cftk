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
import Autocomplete from "@material-ui/lab/Autocomplete";
// https://www.npmjs.com/package/material-ui-chip-input
// npm i --save material-ui-chip-input@next
// import ChipInput from 'material-ui-chip-input' // not working well - hard to style

const AssignRoute = (props) => {
    const phone_helptext = "Enter a phone number, and press Enter to add it.";
    const email_helptext = "Enter an email address, and press Enter to add it.";
    const [phoneData, setPhoneData] = React.useState([]); // phone number list
    const [emailData, setEmailData] = React.useState([]); // email list
    const [groupOptions, setGroupOptions] = React.useState([]);
    const [group, setGroup] = React.useState(null);
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

    React.useEffect(() => {
        const getNames = async (users) => {
            let userNames = [];
            let userRefs = users.map(user => {
                return db.collection('User').doc(user).get();
            })
            await Promise.all(userRefs)
            .then(users => {
                let test = users.map(doc => doc.data().firstName + " " + doc.data().lastName);
                userNames.push(test);
            })
            .catch(error => console.log(error));
            return userNames[0];
        }

        const getGroupOptions = async () => {
            let groupsRef = db.collection("Groups");
            let groupsDoc = await groupsRef.get();
            let groups = []
            groupsDoc.forEach(async (doc) => {
                let buildGroup = doc.id + ": ";
                let userNames = await getNames(doc.data().users);
                userNames.forEach(user => {
                    buildGroup += user + ", "
                })
                groups.push(buildGroup.slice(0, -2));
            });
            setGroupOptions(groups);
        }
        getGroupOptions();
    }, []);



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
    const setActiveRoute = async function(input, streets, houses, users, city) {
        // let streetRef = db.collection("Streets").
        let today = new Date();
        let routeHistory = {
            assignedTo : input.group,
            housesCompleted: 0,
            housesTotal: 0,
            donationTotal: 0,
            pctInterest: 0,
            pctSoliciting: 0,
            streets: {},
            visitDate: String(parseInt(today.getMonth())+1) + '/' + today.getDate()  + '/' + today.getFullYear(),
            city: city
        }
        for (let i in streets) {
            let streetRef = db.collection("Streets").doc(streets[i]);
            let streetDoc = await streetRef.get();
            let gatherHouses = [];

            console.log(streetDoc.data());
            Object.keys(houses[i]).slice(0,-2).forEach(function(houseNumber) {
                if (!(houseNumber === 'city' || houseNumber === 'completed' || houseNumber === 'perInterest' || houseNumber === 'perSoliciting' || houseNumber === 'total' || houseNumber === 'totalVisits')) {
                    routeHistory.housesTotal += 1;
                    let houseInfo = {
                        donationAmt: null,
                        learnMore: null,
                        solicitation: null,
                        volunteerComments: null,
                        coordinates: streetDoc.data()[houseNumber]['coordinates']
                    };
                    gatherHouses.push({
                        [houseNumber] : houseInfo
                    });
                }

            });
            routeHistory.streets[streets[i].split("_")[0]] = gatherHouses;
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
        let groupRef = db.collection('Groups').doc(group);
        groupRef.update({
            assignment: routeUID
        })
        let groupDoc = await groupRef.get();
        if (groupDoc.exists) {
            setUserAssignment(groupDoc.data().users, routeUID);
        }
    }

    const setUserAssignment = async function(users, routeUID) {
        users.forEach((user) => {
            let userRef = db.collection('User').doc(user);
            userRef.update({
                assignment: routeUID
            })
        })
    }

    const isGroupAssigned = async function(group) {
        let groupRef = db.collection('Groups').doc(group);
        const groupDoc = await groupRef.get();
        if (groupDoc.exists) {
            if (groupDoc.data().assignment) {
                return true;
            } else {
                return false; // group is not assigned
            }
        } else {
            return false; // group name not found
        }
    }

    const isUserAssigned = async function(group) {
        let userAssignment = false;
        let groupRef = db.collection('Groups').doc(group);
        const groupDoc = await groupRef.get();
        if (groupDoc.exists) {
            let userRefs = groupDoc.data().users.map(user => {
                return db.collection('User').doc(user).get();
            });
            await Promise.all(userRefs)
            .then(users => {
                let userAssignments = users.map(user => user.data().assignment);
                userAssignments.forEach((status) => {
                    if (status) {
                        userAssignment = true;
                    }
                })
            });
        }
        return userAssignment;
    }

    const isRouteAssigned = async function(route_id) {
        let routeRef = db.collection('Routes').doc(route_id);
        const routeDoc = await routeRef.get();
        if (routeDoc.exists) {
            if (routeDoc.data().assignmentStatus) {
                return true;
            } else {
                return false; // group is not assigned
            }
        } else {
            return false; // group name not found
        }
        
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
    const assign = async () => {
        let input = {
            routeID: props.routes,
            group: group,
            link: document.getElementById('link').value,
            phone_numbers: phoneData,
            emails: emailData,
            message: document.getElementById('message').value,
        }
        let groupAssignment = await isGroupAssigned(input.group);
        let routeAssignment = await isRouteAssigned(input.routeID);
        let userAssignment = await isUserAssigned(input.group);
        if (groupAssignment) {
            console.log('group already assigned to a route');
        } else if (routeAssignment) {
            console.log('route is already assigned to another group');
        } else if (userAssignment) {
            console.log('one of the users is already assigned to a route')
        } else {  
            getStreets(input);
        }

        // TODO possibly change each user's 'assignment' status to the Route UID too, although it may not be necessary
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
            <Autocomplete
                id="combo-box-demo"
                options={groupOptions}
                onChange={(event, value) => {
                    if (value) {
                        setGroup(value.match(/[^:]*/i)[0])
                    } else {
                        setGroup(value);
                    }
                }}
                renderInput={(params) => <TextField {...params} id="group" label="Group Name" fullWidth autoFocus letiant="filled" helperText="Choose an existing group from the volunteer database."/>}
            />
            <br /><br />
            <div>
                <TextField
                    id="link"
                    label="Link"
                    defaultValue="www.cftkcanning.com/routes/example"
                    helperText="Link that anyone can access"
                    letiant="filled"
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
                    letiant="filled"
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
                    letiant="filled"
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
                    letiant="filled"
                />
            </div>
            <br />
            <Grid container justify="flex-end">
                <Button color="primary" my={50} style={{ borderRadius: 50 }} onClick={props.close}>CLOSE</Button>
                <p>&nbsp;&nbsp;&nbsp;</p>
                <Button letiant="contained" ml={50} style={{ borderRadius: 50 }} color="primary"
                    onClick={function (event) { assign(); props.close(); }}
                    disabled={(group === "" || group === null)}
                    >
                    ASSIGN</Button>
            </Grid>
        </Box>

    );

};

export default AssignRoute;