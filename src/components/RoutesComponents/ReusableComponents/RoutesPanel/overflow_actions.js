// ===========================================================================
//                        Overflow Action Methods
// ===========================================================================

import assign from '../../AssignRoute'
// import * as overflow_actions from './overflow_actions.js';
export const editRouteAction  = (route_id) => {
  console.log("editing route id: " + route_id);
}
// export const assignRouteAction = (routeName) => {
//   console.log("assigning route", routeName);
//   // TODO: hookup the click to "Assign Route" - make sure to also pass the route ID.
//   // this function is now defined within RoutesPanel
// }
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
