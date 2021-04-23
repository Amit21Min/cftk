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
              completedRoutes: firebase.firestore.FieldValue.arrayUnion(doc.id),
              assignment: null
            });
          })
        }

        let streets = doc.data().streets;
        let routeName = route_id.split("_")[0];
        let visitDate = doc.data().visitDate;

        for (let street in streets) {
          let pctInterest = 0;
          let pctSoliciting = 0;
          let totalDonationsStreet = 0;
          let housesCompletedStreet = 0;
          let streetFirebase = street + "_" + routeName;
          for (let houseNumber in streets[street]) {
            let key = Object.keys(streets[street][houseNumber])[0] + "." + "visitDates";
            let visitEntry = {[visitDate] : streets[street][houseNumber][Object.keys(streets[street][houseNumber])[0]]}
            // if donationAmt is not null for this house
            if (streets[street][houseNumber][Object.keys(streets[street][houseNumber])[0]].donationAmt) {
              db.collection('Streets').doc(streetFirebase).update({
                [key] :  firebase.firestore.FieldValue.arrayUnion(visitEntry)
              })
              if (streets[street][houseNumber][Object.keys(streets[street][houseNumber])[0]].learnMore) {
                pctInterest += 100;
              }
              if (streets[street][houseNumber][Object.keys(streets[street][houseNumber])[0]].solicitation) {
                pctSoliciting += 100;
              }
              housesCompletedStreet += 1;
              totalDonationsStreet += streets[street][houseNumber][Object.keys(streets[street][houseNumber])[0]].donationAmt;
            }
          }
          // pctInterest = pctInterest / housesCompletedStreet;
          // pctSoliciting = pctSoliciting / housesCompletedStreet;
          let streetRef = db.collection('Streets').doc(streetFirebase)
          let streetDoc = await streetRef.get();
          if (streetDoc.exists) {
            let totalVisits = streetDoc.data().totalVisits;
            let oldPctInterest = streetDoc.data().perInterest;
            let oldPctSoliciting = streetDoc.data().perSoliciting;
            let newPctInterest = (pctInterest + (oldPctInterest * totalVisits)) / (totalVisits + housesCompletedStreet);
            let newPctSoliciting = (pctSoliciting + (oldPctSoliciting * totalVisits)) / (totalVisits + housesCompletedStreet);
            // console.log(newPctInterest, newPctSoliciting)
            // console.log(pctInterest, oldPctInterest, totalVisits, housesCompletedStreet)
            if (housesCompletedStreet > 0) {
              db.collection('Streets').doc(streetFirebase).update({
                perInterest: newPctInterest,
                perSoliciting: newPctSoliciting,
                total: totalDonationsStreet + streetDoc.data().total,
                totalVisits: housesCompletedStreet + streetDoc.data().totalVisits
              })
            }
          }
        }
        let pctInterest = doc.data().pctInterest;
        let pctSoliciting = doc.data().pctSoliciting;

        let routeRef = db.collection('Routes').doc(routeName);
        let routeDoc = await routeRef.get();
        if (routeDoc.exists) {
          let totalCompletions = routeDoc.data().assignmentDates.length - 1;
          let newPctInterest = ((routeDoc.data().perInterest * totalCompletions) + pctInterest) / (totalCompletions + 1);
          let newPctSoliciting = ((routeDoc.data().perSoliciting * totalCompletions) + pctSoliciting) / (totalCompletions + 1);
          db.collection('Routes').doc(routeName).update({
            perInterest: newPctInterest,
            perSoliciting: newPctSoliciting,
            total: doc.data().donationTotal + routeDoc.data().total
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
