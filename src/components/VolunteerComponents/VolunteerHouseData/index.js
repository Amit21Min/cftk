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

import NavBar from "../VolunteerNavBar/index.js";

const App = (props) => {


    function getSteps() {
        return ['Solicitation', 'Interest', 'Donation', 'Comments'];
    }

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleJumptoEnd = () => {
        setActiveStep(3);
    };

    const handleReset = () => {
        setActiveStep(0);
    };




    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
        },
        backButton: {
            marginRight: theme.spacing(1),
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
            height: "150px",
        }
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
                        <p>Was <b>solicitation</b> allowed? {asterisk()}</p>
                        <Grid container justify="space-between">
                            <Button variant="outlined" className={classes.bigButton} onClick={handleNext}>Yes</Button>
                            <Button variant="outlined" className={classes.bigButton} onClick={handleJumptoEnd}>No</Button>
                        </Grid>
                    </div>

                );
            case 1: // Interest
                return (
                    <div>
                        <p>Were the household residents <b>interested in learning more</b> about Carolina for the Kids? {asterisk()}</p>
                        <Grid container justify="space-between">
                            <Button variant="outlined" className={classes.bigButton} onClick={handleNext}>Yes</Button>
                            <Button variant="outlined" className={classes.bigButton} onClick={handleNext}>No</Button>
                        </Grid>
                    </div>

                );
            case 2: // Donation
                return (
                    <div>
                        <p><b>How much</b> did the residents donate? {asterisk()}</p>
                        <FormControl fullWidth className={classes.margin} variant="filled">
                            <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                            <FilledInput
                                id="filled-adornment-amount"
                                // value={values.amount}
                                // onChange={handleChange('amount')}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            />
                        </FormControl>
                        <br/><br/>
                        <p><b>How</b> was the donation provided? {asterisk()}</p>
                        <Grid container justify="space-between">
                            <Button variant="outlined" className={classes.bigButton} onClick={handleNext}>CASH/CHECK</Button>
                            <Button variant="outlined" className={classes.bigButton} onClick={handleNext}>MOBILE PAYMENT</Button>
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
                        />
                    </div>
                );
            default:
                return 'Unknown stepIndex';
        }
    }

    return (
        <div className={classes.root}>
            <h3 className="title">House Address</h3>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <hr />

            <div>
                {activeStep === steps.length ? (
                    <div>
                        <div className={classes.instructions}>All steps completed</div>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <div className={classes.instructions}>{getStepContent(activeStep)}</div>
                        <Grid container justify="space-between">
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Back
                            </Button>
                            <Button variant="contained" color="primary" style={{ borderRadius: 50}} onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                        </Grid>
                    </div>
                )}
            </div>
            <NavBar tab="route-map" />
        </div>
    );
}

export default App;

