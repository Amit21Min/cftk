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
      console.log(route_id, doc.id, doc.id.startsWith(route_id))
      if (doc.id.split("_")[0] === route_id) {
        console.log(route_id, doc.id);
        // this loops through all houses for a given street and gathers the information filled out by the volunteer. This is used to update the "Streets" with the total/averages
        let streets = doc.data().streets;
        let routeName = route_id.split("_")[0];
        let visitDate = doc.data().visitDate;
        let streetStats = [];
        for (let street in streets) {
          let pctInterest = 0;
          let pctSoliciting = 0;
          let totalDonationsStreet = 0;
          let housesCompletedStreet = 0;
          let streetFirebase = street + "_" + routeName;
          for (let houseNumber = 0; houseNumber < streets[street].length; houseNumber++) {
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
          // caculations for each "Street" within the route
          let streetRef = db.collection('Streets').doc(streetFirebase)
          let streetDoc = await streetRef.get();
          if (streetDoc.exists) {
            let totalVisits = streetDoc.data().totalVisits;
            let oldPctInterest = streetDoc.data().perInterest;
            let oldPctSoliciting = streetDoc.data().perSoliciting;
            let newPctInterest = (pctInterest + (oldPctInterest * totalVisits)) / (totalVisits + housesCompletedStreet);
            let newPctSoliciting = (pctSoliciting + (oldPctSoliciting * totalVisits)) / (totalVisits + housesCompletedStreet);
            streetStats.push([newPctInterest, newPctSoliciting, totalVisits + housesCompletedStreet, totalDonationsStreet + streetDoc.data().total])
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
        let newPctInterest = 0;
        let newPctSoliciting = 0;
        let newTotal = 0;
        let totalHouses = 0;
        // streetstats holds the [pctInterest, pctSolciting, totalVisits, totalDonations] for each street, now used for updating "Routes" with the proper stats.
        for (let i = 0; i < streetStats.length; i++) {
          newPctInterest += streetStats[i][0] * streetStats[i][2];
          newPctSoliciting += streetStats[i][1] * streetStats[i][2];
          newTotal += streetStats[i][3];
          totalHouses += streetStats[i][2];
        }
        if (totalHouses === 0) {
          newPctInterest = 0;
          newPctSoliciting = 0;
        } else {
          newPctInterest /= totalHouses;
          newPctSoliciting /= totalHouses;
        }
        // storing the new values in the 'Routes' collection
        db.collection('Routes').doc(routeName).update({
          perInterest: newPctInterest,
          perSoliciting: newPctSoliciting,
          total: newTotal
        })

        // set "assignmentStatus" field to false on the route and "assignmentDates" to the routeUID
        db.collection('Routes').doc(route_id).update({
          assignmentStatus: false,
          assignmentDates: firebase.firestore.FieldValue.arrayUnion(doc.id),
          lastAssigned: doc.data().visitDate
        })
        // deals with the Groups and Users collection (unassigning where needed)
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
        // all calculations and updates to assignments are complete.
        // moves the activeRoute document to Complete
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
export const deleteRouteAction = (routeData) => {
  let streetNames = routeData.streets;
  let routeName = routeData.routeName;
  // unassign the route to ensure no group/user/route is assigned to the route being deleted
  unassignRouteAction(routeName);
  // delete all the streets
  for(let i = 0; i < streetNames.length; i++) {
    db.collection('Streets').doc(streetNames[i]).delete();
  }
  // delete the route - POSSIBLE PROBLEM: The "unassign" function should probably be awaited before these deletions occur, or else they will try to modify deleted routes/streets
  db.collection('Routes').doc(routeName).delete();
}
// These ones are used by the overflow in the column header
export const assignAllAction = () => {
  console.log("Assigning all routes");
}
export const deleteAllAction = () => {
  console.log("Deleting all routes");
}
