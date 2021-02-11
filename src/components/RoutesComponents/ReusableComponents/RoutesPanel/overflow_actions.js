// ===========================================================================
//                        Overflow Action Methods
// ===========================================================================
export const editRouteAction  = (route_id) => {
  console.log("editing route id: " + route_id);
}
export const assignRouteAction = () => {
  console.log("assigning route");
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
