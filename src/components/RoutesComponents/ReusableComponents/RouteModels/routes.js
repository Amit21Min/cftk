import db from '../../../FirebaseComponents/Firebase/firebase.js';

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

export const storeRouteData = async (routeName, houseNumbers, volNotes, city) => {
    // Store each street as a document in FireStore
    // var streets = []
    // for (var street in houseNumbers) {
    //     streets.push(street)
    //     storeStreetData(street, houseNumbers[street], city);
    // }

    // return db.collection("Routes").doc(routeName).set(
    //     {
    //         streets: streets,
    //         assignmentStatus: false,
    //         assignmentDates: {},
    //         perInterest: 0.0,
    //         perSoliciting: 0.0,
    //         total: 0.0,
    //         city: city,
    //         comments: volNotes
    //     })
    const streets = Object.keys(houseNumbers);
    const isOldRoute = await isRouteInStore(routeName);
    if (!isOldRoute) {
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
            console.log(streetName)
            storeStreetData(streetName, houseNumbers[streetName], city)
        }
    }
    // const isNewStreets = await isStreetInStore(Object.keys(houseNumbers), city);


}

export const storeStreetData = (streetName, streetData, city) => {
    console.log(streetData)
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
            city: city
        }

        db.collection("Streets").doc(streetName).set(house, { merge: true });

    }
    return
}

