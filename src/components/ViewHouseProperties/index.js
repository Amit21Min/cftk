import React, { useEffect, useState } from 'react';
import './style.css'
import SearchBar from '../SearchBar'
import {db} from '../Firebase/firebase';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const ViewHouseProperties = () => {

    var streets = ["Hillsborough Street", "Trask Terrace", "South Road", "Manning Drive"];
    const [street, setStreet] = useState(streets[0]);
    
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
            console.log(data);
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

    const handleChange = (event) => {
        setStreet(event.target.value);
      };

    return(
    <div>
        <h2 className="title">Route House Properties</h2>
        <div>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel>Street</InputLabel>
                <Select
                    value={street}
                    onChange={handleChange}
                >
                    {streets.map((street) => 
                        <MenuItem value={street}>{street}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </div>
        <SearchBar prompt="Search house number"/>
        <label className="label">Or select from the list</label>
        <div className="notes">
            <strong>Donations from last canning:</strong>
            <h6>${data.lastDonation}</h6>
            <strong>Solicitation:</strong>
            <h6>{solicitationAllowedText()}</h6>
            <strong>Wants to learn more about CFTK:</strong>
            <h6>{learnMoreText()}</h6>
            <strong>Volunteer comments:</strong>
            <div class="comment">
                <div>
                    <h6>{getComment(0)}</h6>
                    <small>Group {getGroup(0)} | {getDate(0)}</small>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    )
};

export default ViewHouseProperties;