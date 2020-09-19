import React from 'react';
import './style.css'
import SearchBar from '../SearchBar'
import MapContainer from '../Map'

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
    // TODO - get street number + House number from input boxes and pass/store here dynamically
    var street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
    var houseNumber = "425"; // get from input box, dynamically update and re-render
    var source = getHouse(street, houseNumber)

    return(
    <div>
        <h2 className="title">View House Properties</h2>
        <SearchBar prompt="Search house number"/>
        <label className="label">Or select a house on the map</label>
        <div className="google_map">
        {/* <iframe title="viewHouse"
            width="600"
            height="450"
            frameBorder="0" styles="border:0"
            src={source}
            allowFullScreen>
        </iframe> */}
            <MapContainer/>
        </div>
        <div className="notes">
            <strong> Amount collected from last canning:</strong>
            <h6>$0</h6>
            <strong>Solicitation:</strong>
            <h6>Not allowed</h6>
            <strong>Wants to learn more about CFTK:</strong>
            <h6>No</h6>
            <strong>Volunteer comments:</strong>
            <div class="comment">
                <img src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="default" height="50" width="50" ></img>
                <div>
                    <h6>no one was home</h6>
                    <small>Anna Vu 09/12/2020</small>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    )
};

export default ViewHouseProperties;