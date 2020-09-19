import db from '../Firebase/firebase.js';



const toStreet = (streetNames) => {
    var i;
    const streets=[];
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

export const storeRouteData = (uid, routeName, streets, volNotes) => {
    return db.collection("Routes").doc(uid).set( 
        {
            uid: uid,
            name: routeName,
            assignmentStatus: false,
            perInterest: 0.0,
            perSoliciting: 0.0,
            total: 0.0,
            streets: toStreet(streets),
            comments: toComments(volNotes),
            city: ""
        })
}



