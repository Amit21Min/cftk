import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { db } from '../../FirebaseComponents/Firebase/firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '500px',
        position: 'relative'
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom: 5
    },
    nextButton: {
        position: 'absolute',
        right: 0,
        bottom: 5
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: 10,
    },
    bigButton: {
        fontWeight: "bold",
        borderRadius: 10,
        borderWidth: 3,
        margin: "5px",
        width: "45%",
        height: "120px",
    },
}));

const App = (props) => {

    // is all the information completed?
    // const [complete, setComplete] = React.useState(false);
    // user inputs
    const [sol, setSol] = React.useState(-1); // Solicitation allowed? -1: unselected, 0: no, 1: yes
    const [interest, setInterest] = React.useState(-1);
    const [amount, setAmount] = React.useState(-1); // Amount donated
    // const [amountstr, setAmountstr] = React.useState("");
    const [method, setMethod] = React.useState(-1); // -1: unselected, 0: cash/check, 1: mobile
    const [comment, setComment] = React.useState("");

    // managing steps
    function getSteps() {
        return ['Solicitation', 'Interest', 'Donation', 'Comments'];
    }

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        if (activeStep === 3) {
            saveData();
        }
        if(activeStep===0 && sol===0){setActiveStep(3);} // jump to last step if solicitation not allowed
        else{setActiveStep((prevActiveStep) => prevActiveStep + 1);}
    };

    const handleBack = () => {
        if(activeStep===3 && sol===0){setActiveStep(0);} // back to first step if solicitation not allowed
        else{setActiveStep((prevActiveStep) => prevActiveStep - 1);}
    };

    const handleUpdate = () => {
        setActiveStep(0);
    };

    const handleAmountChange =(e)=>{
        let a = document.getElementById('amount').value.trim();
        // a = a.replace(/\D/g, ''); // delelte non-digits
        a = parseFloat(a);
        if(a>0){setAmount(a);}        
        document.getElementById('amount').value = a;
    }

    React.useEffect(() => {
        // This will reset everything back to it's default state
        setSol(-1);
        setInterest(-1);
        setAmount(-1);
        setMethod(-1);
        setComment(-1);
        setActiveStep(0);
        // setComplete(false);
        // setAmountstr("");
    }, [props.addr])


    // styles and effects
    const timeout = 150; // button timeout to show it's selected before jumping to next step 
    const classes = useStyles();

    const asterisk = () => {
        return <span style={{ color: "red" }}>*</span>;
    }

    // function that deals entirely with saving the house data to firebase when submit is pressed.
    const saveData = async () => {
        let addr = props.addr;
        let routeName = props.routeName;
        let newStreetData;
        let update = false;
        let routesActiveDoc = await db.collection("RoutesActive").doc(routeName).get();
        if (routesActiveDoc.exists) {
            let street = routesActiveDoc.data().streets[addr.split("_")[1]];
            for (let i in street) {
                if (Object.keys(street[i])[0] === addr.split("_")[0]) {
                    // if the donationAmt that we are about to set is not null, then this is an update -> which means we need to undo the calculations for the
                    // house that we are about to update information for.
                    if (street[i][Object.keys(street[i])[0]].donationAmt !== null) {
                        update = true;
                        if (routesActiveDoc.data().housesCompleted - 1 === 0) {
                            db.collection('RoutesActive').doc(routeName).update({
                                donationTotal : 0,
                                housesCompleted : 0,
                                pctSoliciting : 0,
                                pctInterest : 0
                            })
                        } else {
                            let newPctSoliciting;
                            let newPctInterest; 
                            if (street[i][Object.keys(street[i])[0]].learnMore) {
                                newPctInterest = (routesActiveDoc.data().pctInterest * routesActiveDoc.data().housesCompleted - 100) / (routesActiveDoc.data().housesCompleted - 1)
                            } else {
                                newPctInterest = (routesActiveDoc.data().pctInterest * routesActiveDoc.data().housesCompleted) / (routesActiveDoc.data().housesCompleted - 1)
                            }
                            if (street[i][Object.keys(street[i])[0]].solicitation) {
                                newPctSoliciting = (routesActiveDoc.data().pctSoliciting * routesActiveDoc.data().housesCompleted - 100) / (routesActiveDoc.data().housesCompleted - 1)
                            } else {
                                newPctSoliciting = (routesActiveDoc.data().pctSoliciting * routesActiveDoc.data().housesCompleted) / (routesActiveDoc.data().housesCompleted - 1)
                                newPctInterest = (routesActiveDoc.data().pctInterest * routesActiveDoc.data().housesCompleted) / (routesActiveDoc.data().housesCompleted - 1)
                            }
                            db.collection('RoutesActive').doc(routeName).update({
                                donationTotal : routesActiveDoc.data().donationTotal - street[i][Object.keys(street[i])[0]].donationAmt,
                                housesCompleted : routesActiveDoc.data().housesCompleted - 1,
                                pctSoliciting : newPctSoliciting,
                                pctInterest : newPctInterest
                            })
                        }
                    }
                    // stores the new information submitted in the street object. The street object is then inserted back into the entire doc.data() so that it can be set to firebase.
                    street[i] = {
                        [Object.keys(street[i])[0]] : {
                            donationAmt : amount,
                            learnMore : interest === 1 ? true : false,
                            solicitation : sol === 1 ? true : false,
                            volunteerComments : comment.length > 0 ? comment : null,
                            coordinates : street[i][Object.keys(street[i])[0]].coordinates
                        }
                    }
                    newStreetData = street;
                }
            }
        }
        // calculations for updating the RoutesActive document fields donationTotal, housesCompleted, pctInterest, and pctSoliciting
        let tempInterest = interest
        if (!sol) {
            tempInterest = false;
        }
        if (update) {
            routesActiveDoc = await db.collection("RoutesActive").doc(routeName).get();
        }
        let newDocData = routesActiveDoc.data();
        newDocData.streets[addr.split("_")[1]] = newStreetData;
        if (tempInterest) {
            newDocData.pctInterest = (newDocData.pctInterest * newDocData.housesCompleted + 100) / (newDocData.housesCompleted + 1);
        } else {
            newDocData.pctInterest = (newDocData.pctInterest * newDocData.housesCompleted) / (newDocData.housesCompleted + 1);
        }
        if (sol) {
            newDocData.pctSoliciting = (newDocData.pctSoliciting * newDocData.housesCompleted + 100) / (newDocData.housesCompleted + 1);
        } else {
            newDocData.pctSoliciting = (newDocData.pctSoliciting * newDocData.housesCompleted) / (newDocData.housesCompleted + 1);
        }
        newDocData.donationTotal += amount;
        newDocData.housesCompleted += 1;
        db.collection('RoutesActive').doc(routeName).set(newDocData);
        setAmount(0);
    }

    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0: // Solicitation
                return (
                    <div>
                        <p></p>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align='center'> Was <b>solicitation</b> allowed?{asterisk()} </Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Button variant="outlined" color={sol===1?"primary":"default"} className={classes.bigButton} 
                            onClick={function (event) {setSol(1);setTimeout(()=>{setActiveStep(1);}, timeout);}}>Yes</Button>
                            <Button variant="outlined" color={sol===0?"primary":"default"} className={classes.bigButton} 
                            onClick={function (event) {setSol(0);setTimeout(()=>{setActiveStep(3);}, timeout);}}>No</Button>
                        </Grid>
                    </div>

                );
            case 1: // Interest
                return (
                    <div>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align='center'><p>Were the household residents <b>interested in learning more</b> about Carolina for the Kids? {asterisk()}</p></Typography>
                        </Grid>

                        <Grid container justify="space-between">
                            <Button variant="outlined" color={interest===1?"primary":"default"} className={classes.bigButton} 
                            onClick={function (event) {setInterest(1);setTimeout(()=>{setActiveStep(2);}, timeout);}}>Yes</Button>
                            <Button variant="outlined" color={interest===0?"primary":"default"} className={classes.bigButton}
                            onClick={function (event) {setInterest(0);setTimeout(()=>{setActiveStep(2);}, timeout);}}>No</Button>
                        </Grid>
                    </div>

                );
            case 2: // Donation
                return (
                    <div>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align='center'> <p><b>How much</b> did the residents donate? {asterisk()}</p></Typography>
                        </Grid>

                        <FormControl fullWidth className={classes.margin} variant="filled">
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <FilledInput
                                id="amount"
                                // value={values.amount}
                                // onChange={handleAmountChange}
                                onBlur = {handleAmountChange}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            />
                        </FormControl>
                        <br /><br />
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align='center'>  <p><b>How</b> was the donation provided? {asterisk()}</p> </Typography>
                        </Grid>

                        <Grid container justify="space-between">
                            <Button variant="outlined" className={classes.bigButton} color={method===0?"primary":"default"}
                            onClick={function (event) {setMethod(0);}} disabled={amount<=-10}>CASH/CHECK</Button>
                            <Button variant="outlined" className={classes.bigButton} color={method===1?"primary":"default"}
                            onClick={function (event) {setMethod(1);}} disabled={amount<=-10}>MOBILE PAYMENT</Button>
                        </Grid>

                    </div>

                );
            case 3: // Comments
                return (
                    <div>
                        <TextField
                            id="message"
                            label="Comments"
                            fullWidth
                            multiline
                            rowsMax={5}
                            rows={1}
                            variant="filled"
                            onBlur={function(event){console.log("record message"); setComment(document.getElementById("message").value)}}
                        />
                    </div>
                );
            default:
                return 'Unknown stepIndex';
        }
    }

    return (
        <div className={classes.root}>
            {/* <Typography variant="h5" style={{ margin: 10 }} gutterBottom>{props.addr}
            <IconButton aria-label="close" style={{ float: "right", display: "inline" }} onClick={props.close}>
                <CloseIcon />
            </IconButton>
            </Typography> */}
            <div>
                {activeStep === steps.length ? (
                    <div>
                        {/* summary screen •*/}
                        {/* <div className={classes.instructions}>COMPLETE</div> */}
                        <Button variant="contained" color="primary" style={{ borderRadius: 50 }} onClick={handleUpdate}>
                            Update
                        </Button>
                        <ul>
                            <li>● Solicitation {sol===1?"allowed":"not allowed"}</li>
                            {sol===1?(
                                <div>
                                <li>{interest===1?"● Interested":"● Not interested"} in learning more</li>
                                <li>
                                    {amount>0?(
                                        "● Donated $"+amount+" via "+(method===0?"cash or check":"mobile payment")
                                    ):("● No donation provided")}
                                </li>
                                </div>
                            ):("")}
                            <li>● Additional Comments: {comment===""?"None":comment}</li>
                        </ul>
                    </div>
                ) : (
                    <div>
                        <Stepper activeStep={activeStep} alternativeLabel style={{margin:'-5px'}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <hr />
                        <div>
                            <div className={classes.instructions}>{getStepContent(activeStep)}</div>
                            <Grid item xs={12}>

                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    BACK
                                </Button>

                                <Button variant="contained" color="primary" style={{ borderRadius: 50 }} className={classes.nextButton} onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Submit' : 'CONTINUE'}
                                </Button>

                            </Grid>
                        </div>
                    </div>
                )}
            </div>
            {/* <NavBar tab="route-map" /> */}
        </div>
    );
}

export default App;