// ===========================================================================
//                        Overflow Action Methods
// ===========================================================================

import assign from '../../AssignRoute'
import { db } from '../../../FirebaseComponents/Firebase/firebase';
import firebase from 'firebase/app';
// import * as overflow_actions from './overflow_actions.js';
export const editRouteAction  = (route_id) => {
  console.log("editing route id: " + route_id);
}

export const unassignRouteAction = async function(route_id) {
  db.collection("RoutesActive").get().then((querySnapshot) => {
    querySnapshot.forEach(async function(doc) {
      if (doc.id.startsWith(route_id)) {
        // set "assignmentStatus" field to false on the route and "assignmentDates" to the routeUID
        db.collection('Routes').doc(route_id).update({
          assignmentStatus: false,
          assignmentDates: firebase.firestore.FieldValue.arrayUnion(doc.id)
        })
        var group = doc.data().assignedTo;
        var groupRef = db.collection('Groups').doc(group);
        var groupDoc = await groupRef.get();
        // updates the Groups "assignment" field
        if (groupDoc.exists) {
          groupRef.update({
            assignment: null
          })
          // adds the Route UID to the history of each user within the group
          var users = groupDoc.data().users;
          users.forEach((user) => {
            db.collection('User').doc(user).update({
              completedRoutes: firebase.firestore.FieldValue.arrayUnion(doc.id)
            });
          })
        }

        // move the route to Complete and delete the Active version
        db.collection('RoutesComplete').doc(doc.id).set(doc.data());
        db.collection('RoutesActive').doc(doc.id).delete();
      }
    })  
  });

}

export const housePropertiesAction = () => {
  console.log("house properties");
}
export const revisionHistoryAction = () => {
  console.log("revision history");
}
export const deleteRouteAction = (route_id) => {
  console.log("deleting route id: " + route_id);
}
// These ones are used by the overflow in the column header
export const assignAllAction = () => {
  console.log("Assigning all routes");
}
export const deleteAllAction = () => {
  console.log("Deleting all routes");
}
