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
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { positions } from '@material-ui/system';
import { db } from '../../FirebaseComponents/Firebase/firebase';


import NavBar from "../VolunteerNavBar/index.js";

const App = (props) => {

    // is all the information completed?
    const [complete, setComplete] = React.useState(false);
    // user inputs
    const [sol, setSol] = React.useState(-1); // Solicitation allowed? -1: unselected, 0: no, 1: yes
    const [interest, setInterest] = React.useState(-1);
    const [amount, setAmount] = React.useState(-1); // Amount donated
    const [amountstr, setAmountstr] = React.useState("");
    const [method, setMethod] = React.useState(-1); // -1: unselected, 0: cash/check, 1: mobile
    const [comment, setComment] = React.useState("");


    // managing steps
    function getSteps() {
        return ['Solicitation', 'Interest', 'Donation', 'Comments'];
    }

    const [activeStep, setActiveStep] = React.useState(4);
    const steps = getSteps();

    const saveData = () => {
        console.log(sol, interest, amount, method, comment);
        console.log(props.addr);
        console.log(props.house);
        let newStreetData;
        let oldStreetData;
        let routeName = props.addr.split("_")[1];
        db.collection("RoutesActive").get().then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                if (routeName === doc.id.split("_")[0]) {
                    let routesActiveDoc = await db.collection("RoutesActive").doc(doc.id).get();
                    if (routesActiveDoc.exists) {
                        let street = routesActiveDoc.data().streets[props.addr.split("_")[0]];
                        console.log(street);
                        for (let i in street) {
                            oldStreetData = JSON.parse(JSON.stringify(street));
                            if (Object.keys(street[i])[0] === props.house) {
                                console.log(street[i]);
                                street[i] = { 
                                    [Object.keys(street[i])[0]] : {
                                        donationAmt : amount,
                                        learnMore : interest === 1 ? true : false,
                                        solicitation : sol === 1 ? true : false,
                                        volunteerComments : comment.length > 0 ? comment : null,
                                    }
                                }
                                newStreetData = street;
                                console.log(newStreetData);
                            }
                        }
                    }
                    let newDocData = doc.data();
                    newDocData.streets[props.addr.split("_")[0]] = newStreetData;

                    console.log(oldStreetData);
                    // newDocData.donationTotal += amount;
                    // newDocData.housesCompleted += 1;
                    db.collection('RoutesActive').doc(doc.id).set(newDocData);

                    // console.log(newStreetData);
                    // let fieldName = "streets." + props.addr.split("_")[0];
                    // console.log(fieldName);
                    // db.collection('RoutesActive').doc(doc.id).update({
                    //     [fieldName] : newStreetData
                    // });
                }
            })
        })
        // console.log(props.)
        // let routesActiveRef = 
    }

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

        // let a = document.getElementById('amount').value.trim();
        // a = a.replace(/\D/g, ''); // delelte non-digits
        // let len = a.length;
        // console.log(a);
        // console.log(len);
        // for(let i=len-3; i<3; i++){
        //     a = '0'+a;
        // }
        // a = a.substring(0,len-2)+'.'+a[len-2]+a[len-1];
        // console.log(a)
        // a = parseFloat(a);
        // console.log(a);
        // document.getElementById('amount').value = a;
    }


    // styles and effects
    const timeout = 150; // button timeout to show it's selected before jumping to next step 

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: '600px'
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
    const classes = useStyles();

    const asterisk = () => {
        return <span style={{ color: "red" }}>*</span>;
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
            <Typography variant="h5" style={{ margin: 10 }} gutterBottom>{props.addr}
            {/* <Typography variant="h5" style={{ margin: 10 }} gutterBottom>{props.house} {props.addr.split('_')[0]} */}
            <IconButton aria-label="close" style={{ float: "right", display: "inline" }} onClick={props.close}>
                <CloseIcon />
            </IconButton>
            </Typography>
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