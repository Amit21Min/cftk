import db from '../../../FirebaseComponents/Firebase/firebase.js';
import { validationStates } from './routeConstants';

const toStreet = (streetNames) => {
    var i;
    const streets = [];
    for (i = 0; i < streetNames.length; i++) {
        streets.push({
            name: streetNames[i]
        })
    }
    return streets;
}

const toComments = (notes) => {
    var i;
    const comments = [];
    for (i = 0; i < notes.length; i++) {
        comments.push({
            note: notes[i]
        })
    }
    return comments;
}



export const editRouteData = (routeName, streets, volNotes, city) => {

    db.collection("Routes").doc(routeName).update(
        {
            streets: streets,
            assignmentStatus: false,
            assignmentDates: {},
            perInterest: 0.0,
            perSoliciting: 0.0,
            total: 0.0,
            city: city,
            comments: (volNotes)
        })


}

// Housenumbers looks like:
// {
//     street1: [123,124,125],
//     street2: [1,2,3,4]
// }

function isStreetsInStore(streets, city) {
    // Returns a Promise that will say whether or not a street of that id is already in the firestore
    return new Promise(resolve => {
        db.collection("Streets")
            .where('__name__', 'in', streets)
            .where('city', '==', city)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.empty) resolve(false);
                else resolve(true);
            });
    })
}

function isRouteInStore(routeName) {
    // Returns a Promise that will say whether or not a route of that id is already in the firestore
    return new Promise(resolve => {
        db.collection("Routes")
            .where('__name__', '==', routeName)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.empty) resolve(false);
                else resolve(true);
            })
    })
}

export const storeEditRouteData = async (routeName, houseNumbers, volNotes, city, canningDate, numDonated, prevData) => {

    var streets = Object.keys(houseNumbers);
    const isOldRoute = await isRouteInStore(routeName);
    if (!isOldRoute) return {
        // Checks if the route still exists
        state: validationStates.ERROR,
        message: `The Route: ${routeName} could not be found`
    }

    streets = streets.map((street) => {
        return (street + '_' + routeName);
    });
    // Update seems to work well here
    db.collection("Routes")
        .doc(routeName)
        .update({
            streets: streets,
            assignmentStatus: false,
            city: city,
            comments: volNotes
        });
    for (let streetName of streets) {
        // Get the previous street's data
        let prevStreet = prevData.streetData.find(obj => obj.name === streetName)
        // Store it
        storeStreetData(streetName, houseNumbers[streetName.split("_")[0]], city, prevStreet)
    }

    // Remove this if no longer wanting to delete street docs
    for (let data of prevData.streetData) {
        if (streets.indexOf(data.name) < 0) {
            db.collection("Streets").doc(data.name).delete();
        }
    }

    // const isNewStreets = await isStreetInStore(Object.keys(houseNumbers), city);
    return {
        state: validationStates.SUCCESS,
        message: `${routeName} has been edited successfully.`
    }


}

export const storeNewRouteData = async (routeName, houseNumbers, volNotes, city, canningDate, numDonated) => {

    var streets = Object.keys(houseNumbers);
    const isOldRoute = await isRouteInStore(routeName);
    if (isOldRoute) return {
        state: validationStates.ERROR,
        message: `A route with the name: ${routeName} already exists. Please pick a new name.`
    }
    streets = streets.map((street) => {
        return (street + '_' + routeName);
    });

    db.collection("Routes")
        .doc(routeName)
        .set({
            streets: streets,
            assignmentStatus: false,
            assignmentDates: {},
            perInterest: 0.0,
            perSoliciting: 0.0,
            total: 0.0,
            city: city,
            comments: volNotes
        });
    for (let streetName of streets) {
        storeStreetData(streetName, houseNumbers[streetName.split("_")[0]], city)
    }
    // const isNewStreets = await isStreetInStore(Object.keys(houseNumbers), city);
    return {
        state: validationStates.SUCCESS,
        message: `${routeName} has been added successfully.`
    }


}

export const storeStreetData = (streetName, streetData, city, prevStreet = null) => {
    // Supplants old data, if there is any
    // PrevStreet is an optional parameter that defaults to null
    // The values on the right side of the ?? are the default values
    let house = {
        completed: prevStreet?.completed ?? false,
        city: city,
        total: prevStreet?.total ?? 0,
        perInterest: prevStreet?.perInterest ?? 0,
        perSoliciting: prevStreet?.perSoliciting ?? 0,
        totalVisits: 0,
    }
    for (let houseNumber in streetData) {
        let coords = streetData[houseNumber]
        if (prevStreet && prevStreet[houseNumber]) {
            // Uses old data if the street was originally part of the route
            house[houseNumber] = prevStreet[houseNumber]
        } else {
            // Initializes new one if not
            house[houseNumber] = {
                "visitDates": [
                    // {
                    //     "09/01/2020":
                    //     {
                    //         "donationAmt": 150,
                    //         "solicitation": "True",
                    //         "learnMore": "True",
                    //         "volunteerComments": "comments"
                    //     }
                    // }
                ],
                "coordinates": coords
            }
        }

    }
    db.collection("Streets").doc(streetName).set(house);
    return
}

export const getMapAddresses = async (routeId) => {
    let returnObj = {
        streetData: [],
        comments: [],
        error: ""
    }

    if (!routeId || routeId === "") return returnObj;
    try {
        const { streets = [], comments = [] } = await new Promise((resolve, reject) => {
            db.collection("Routes")
                .doc(routeId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data()
                        resolve(data)
                    } else {
                        reject("Route does not exist")
                    }
                })
        });
        let streetPromises = [];
        for (let street in streets) {
            const streetName = streets[street];
            streetPromises.push(new Promise((resolve, reject) => {
                db.collection("Streets")
                    .doc(streetName)
                    .get()
                    .then(doc => {
                        if (!doc.exists) reject(`The data for the street ${streetName} cannot be found`);
                        resolve({
                            name: streetName,
                            ...doc.data()
                        })
                    })
            }))

            returnObj.comments = comments;
        }

        const newData = await Promise.all(streetPromises);
        returnObj.streetData = newData;
        return returnObj;
    } catch (error) {
        returnObj = {
            streetData: [],
            comments: [],
            error: error
        }
        return returnObj;
    }
}

export const getAssignedRoute = async (uid) => {
    try {
        const userRef = db.collection('User').doc(uid);
        const userDoc = await userRef.get();
        // Gets assignment
        const assignment = userDoc.exists ? userDoc.data().assignment : '';
        return assignment;
    } catch (error) {
        console.error(error)
        return null;
    }
}