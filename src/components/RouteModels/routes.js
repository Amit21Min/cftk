import db from '../Firebase/firebase.js';

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

export const storeRouteData = (routeName, houseNumbers, volNotes, city) => {
    // Store each street as a document in FireStore
    var streets = []
    for (var street in houseNumbers) {
        streets.push(street)
        storeStreetData(street, houseNumbers[street], city);
    }

    return db.collection("Routes").doc(routeName).set(
        {
            streets: streets,
            assignmentStatus: false,
            assignmentDates: {},
            perInterest: 0.0,
            perSoliciting: 0.0,
            total: 0.0,
            city: city,
            comments: volNotes
        })
}

export const storeStreetData = (street, houseNumbers, city) => {
    for (var i = 0; i < houseNumbers.length; i++) {
        var houseNumber = houseNumbers[i]
        var house = {
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
                ]
            },
            completed: true,
            city: city
        }

        db.collection("Streets").doc(street).set(house, { merge: true });

    }
    return
}

