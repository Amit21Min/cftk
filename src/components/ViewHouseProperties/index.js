import React, { useEffect, useState } from 'react';
import './style.css'
import SearchBar from '../SearchBar'
import {db} from '../Firebase/firebase';

// FOR CREATE/UPDATE ROUTES PAGE - build a list of origin+destinations to display a route on google maps
// EXAMPLE FUNCTION CALL - var source = getRoute(["Franklin+St", "Hillsborough+St", "Bolinwood+Dr", "N+Boundary+St"]);

// function getRoute(streetArray) {
//     // streetArray needs to be an array of streets, ex. ["Franklin+St", "Hillsborough+St", "Bolinwood+Dr", "N+Boundary+St"]
//     var maps_API = process.env.REACT_APP_MAPS_API_KEY
//     var routeString = "&origin=" + streetArray[0]
//     routeString += "&destination=" + streetArray[streetArray.length - 1]
//     routeString += "&waypoints="
//     for (var i = 1; i < streetArray.length - 1; i++) {
//         routeString += streetArray[i];
//         if (i < streetArray.length - 2) {
//             routeString += "|"
//         }
//     }
//     // example routeString = &origin=Franklin+St&destination=N+Boundary+St&waypoints=Hillsborough+St|Bolinwood+Dr
//     return `https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_MAPS_API_KEY}${routeString}&mode=walking`;
// }

// build a specific house address and return
function getHouse(street, houseNumber) {
    var address = `${houseNumber}+${street}`;
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
}

const ViewHouseProperties = () => {

    const [house, setHouse] = useState({
        street: "Hillsborough Street",
        house_number: "425",
    });
    
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

    // TODO - get street number + House number from input boxes and pass/store here dynamically
    var street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
    var houseNumber = "425"; // get from input box, dynamically update and re-render
    var source = getHouse(street, houseNumber)

    return(
    <div>
        <h2 className="title">Hillsborough Street House Properties</h2>
        <SearchBar prompt="Search house number"/>
        <label className="label">Or select a house on the map</label>
        <div className="google_map">
<<<<<<< HEAD
        {/* <iframe title="viewHouse"
            width="600"
            height="450"
            frameBorder="0" styles="border:0"
            src={source}
            allowFullScreen>
        </iframe> */}
            <MapContainer/>
=======
            <iframe title="viewHouse"
                width="600"
                height="450"
                frameBorder="0" styles="border:0"
                src={source}
                allowFullScreen>
            </iframe>
>>>>>>> master
        </div>
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