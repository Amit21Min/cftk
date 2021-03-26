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
            assingmentDates: {},
            perInterest: 0.0,
            perSoliciting: 0.0,
            total: 0.0,
            city: city,
            comments: volNotes
        });
    for (let streetName of streets) {
        console.log(streetName);
        storeStreetData(streetName, houseNumbers[streetName.split("_")[0]], city)
    }
    // const isNewStreets = await isStreetInStore(Object.keys(houseNumbers), city);
    return {
        state: validationStates.SUCCESS,
        message: `${routeName} has been added successfully.`
    }


}

export const storeStreetData = (streetName, streetData, city) => {
    for (let houseNumber in streetData) {
        let coords = streetData[houseNumber]
        let house = {
            [houseNumber]:
            {
                "visitDates": [
                    {
                        "09/01/2020":
                        {
                            "donationAmt": 150,
                            "solicitation": "True",
                            "learnMore": "True",
                            "volunteerComments": "comments"
                        }
                    }
                ],
                "coordinates": coords
            },
            completed: true,
            city: city,
            total: 0,
            perInterest: 0,
            perSoliciting: 0,
        }

        db.collection("Streets").doc(streetName).set(house, { merge: true });

    }
    return
}

export const getMapAddresses = async (routeId) => {
    let returnObj = {
        streetData: [],
        error: ""
    }

    if (!routeId || routeId === "") return returnObj;
    try {
        let streetNames = await new Promise((resolve, reject) => {
            db.collection("Routes")
                .doc(routeId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        resolve(doc.data().streets || [])
                    } else {
                        reject("Route does not exist")
                    }
                })
        });
        
        let streetPromises = [];
        for (let street in streetNames) {
            const streetName = streetNames[street];
            streetPromises.push(new Promise((resolve, reject) => {
                db.collection("Streets")
                .doc(streetName)
                .get()
                .then(doc => {
                    if (!doc.exists) reject(`The data for the street ${streetName} cannot be found`);
                    let simplifiedStreet = {
                        name: streetName,
                        addresses: {}
                    };
                    for (const [key, value] of Object.entries(doc.data())) {
                        if (key === 'city') {
                            simplifiedStreet[key] = value;
                        } else if ( key !== 'completed') {
                            simplifiedStreet.addresses[key] = value.coordinates
                        }
                    }
                    resolve(simplifiedStreet)
                })
            }))
        }

        const newData = await Promise.all(streetPromises);
        returnObj.streetData = newData;
        return returnObj;
    } catch (error) {
        returnObj = {
            streetData: [],
            error: error
        }
        return returnObj;
    }
}
