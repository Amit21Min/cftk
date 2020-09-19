import db from '../Firebase/firebase.js';



/* toStreet:
    input: string[] streetNames
    output: 'street'[] streets 
        this array should have each street with its necessary properties
*/
const toStreet = (streetNames) => {
    var i;
    const streets=[];
    for (i = 0; i < streetNames.length; i++) {
        streets.push({
            name: streetNames[i]
            // more properties of the streets to come
            /*
            house: [houses]
             --> this house properties should be combined with the house data structure
            */
        })
    }
    return streets;
}

/* toComments:
    input:string[] notes
    output: 'comment'[] comments
        this returned array should have each comment with its necessary properties
    
*/
const toComments = (notes) => {
    var i;
    const comments = [];
    for (i = 0; i < notes.length; i++) {
        comments.push({
            note: notes[i]
            /*
            (if necessary) user: userName
            date: date
            */
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



