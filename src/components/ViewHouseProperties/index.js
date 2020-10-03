import React, { useEffect, useState } from 'react';
import './style.css'
import {db} from '../Firebase/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { CardContent } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    houseList: {
        maxWidth: 300,
    }
  }));

const ViewHouseProperties = () => {

    var streets = ["Hillsborough Street", "Trask Terrace", "South Road", "Manning Drive"];
    var numbers = [101, 102, 103, 104, 105, 106, 107, 108, 109];
    const [street, setStreet] = useState(streets[0]);
    const [number, setNumber] = useState(numbers[0]);
    const [street_selected, setStreetSelected] = useState(false);
    const [house_selected, setHouseSelected] = useState(false);

    const classes = useStyles();

    const [data, setData] = useState({
        lastDonation: null,
        solicitationAllowed: null,
        learnMore: null,
        comments: [{
            comment: null,
            date: null,
            group: null
        }]
    });

    useEffect(() => {
        db.collection("House").doc("model").get().then(doc => {
            const data = doc.data();
            let all_comments = [];
            for(let i = 0; i < data.visits.length; i++){
                all_comments.push({
                    comment: data.visits[i].comment,
                    date: data.visits[i].date.toDate().toDateString(),
                    group: data.visits[i].group
                });
            }
            setData({
                lastDonation: data.visits[data.visits.length-1].donationAmount,
                solicitationAllowed: data.visits[data.visits.length-1].solicitationAllowed,
                learnMore: data.visits[data.visits.length-1].learnMore,
                comments: all_comments
            });
        })
    });

    const solicitationAllowedText = () => {
        return data.solicitationAllowed ? "Allowed" : "Not Allowed";
    }

    const learnMoreText = () => {
        return data.learnMore ? "Yes" : "No";
    }

    const getComment = (index) => {
        return data.comments[0].comment;
    }

    const getGroup = (index) => {
        return data.comments[0].group;
    }

    const getDate = (index) => {
        return data.comments[0].date;
    }

    const handleStreetChange = (event, value, reason) => {
        if (reason === "select-option") {
            setStreetSelected(true);
        }
        if (reason === "clear") {
            setStreetSelected(false);
        }
        setStreet(value);
    };

    const handleNumberChange = (event, value, reason) => {
        if (reason === "select-option") {
            setHouseSelected(true);
        }
        if (reason === "clear") {
            setHouseSelected(false);
        }
        setNumber(value)
    }

    function HouseProperties(props) {
        if (!props.house) {
          return (
              <b id="selectHouse">Select a house to view its properties</b>
          )
        }
      
        return (    
            
           <Grid item>
            <Card>
                <CardContent>
                    <strong>Solicitation</strong>
                    <div>
                        <h6>{solicitationAllowedText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{solicitationAllowedText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{solicitationAllowedText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small">View More</Button>
                </CardActions>
            </Card>

            <Card>
                <CardContent>
                    <strong>Donations</strong>
                    <div>
                        <h6>${data.lastDonation}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>${data.lastDonation}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>${data.lastDonation}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small">View More</Button>
                </CardActions>
            </Card>

            <Card>
                <CardContent>
                    <strong>Volunteer Comments</strong>
                    <div>
                        <h6>{getComment(0)}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{getComment(0)}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{getComment(0)}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small">View More</Button>
                </CardActions>
            </Card>

            <Card>
                <CardContent>
                    <strong>Interested in Learning More</strong>
                    <div>
                        <h6>{learnMoreText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{learnMoreText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                    <Divider />
                    <div>
                        <h6>{learnMoreText()}</h6>
                        <small>Group {getGroup(0)} | {getDate(0)}</small>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small">View More</Button>
                </CardActions>
            </Card>

            </Grid> 
            
        );
      }

    return(
   <div>
        <h2 className="title">Route House Properties</h2>
        <Grid container spacing={2}>
            <Grid item>
            <div className = "street-select">
                <Autocomplete
                id="street-select"
                options={streets}
                getOptionLabel={(option) => option.toString()}
                 style={{ width: 275}}
                 onChange={handleStreetChange}
                 renderInput={(params) => <TextField {...params} label="Street name" variant="outlined"/>}
                /> 
            </div>
            </Grid>
            <Grid item>
            <div className = "house-select">
                <Autocomplete
                id="numbers-select"
                options={numbers}
                getOptionLabel={(option) => option.toString()}
                 style={{ width: 275}}
                 disabled= {(!street_selected)}
                 onChange={handleNumberChange}
                 renderInput={(params) => <TextField {...params} label="House number" variant="outlined" disabled={!street_selected}/>}
                /> 
            </div>
            </Grid>
            <Divider orientation="vertical" flexItem/>

            <HouseProperties house={house_selected} />
            
            <div class="clearfix"></div>
        </Grid>
    </div>
    )
};

export default ViewHouseProperties;