import React, {useState, useEffect} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import SearchBar from '../SearchBar';
import AddButton from '../AddButton';
import ResourceIndexTable from '../ResourceIndexTable';
import PanelBanner from '../PanelBanner';

import Box from '@material-ui/core/Box';
import { db } from '../Firebase/firebase';

import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import "./index.css";

// A recursive helper function for allowing state to update when changing complex/deeply nested objects
const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject;
  }

  outObject = Array.isArray(inObject) ? [] : {};
  for(key in inObject){
    value = inObject[key]
    outObject[key] = deepCopyFunction(value);
  }
  return outObject
}

const useForceUpdate = () => useState()[1];


const RoutesPanel = () => {
  const forceUpdate = useForceUpdate();
  const [routes, setRoutes] = useState(null);
  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });

  // This state object will be used to construct GET requests to our Routes resource. Takes a query string for text search, and a sort option.
  const [queryState, setQueryState] = useState({sort: false, queryString: ""});

  // This is used by a ResourceIndexTable to define the column names of an html table, as well as to fit the data from each row into the appropriate column.
  // Provides its keys to resourceIndexItem(s) to be used as accessors to correctly match data to html table columns. The string per key is the text which is displayed as the html table column headers
  const [routeColumnNames, setRouteColumnNames] = useState([
    {field: "selectbox",             type: "selectbox",        html_text: "", selected_items: []},
    {field: "drop_down",             type: "drop-down-parent", html_text: ""},
    {field: "name",                  type: "text",             html_text: "Name"},
    {field: "assignment_status",     type: "text",             html_text: "Assignment Status"},
    {field: "months_since_assigned", type: "text",             html_text: "Months Since Last Assigned"},
    {field: "amount_collected",      type: "text",             html_text: "Previous Canning Donations"},
    {field: "outreach_pct",          type: "text",             html_text: "Wants to Learn More"},
    {field: "soliciting_pct",        type: "text",             html_text: "Allows Soliciting"},
    {field: "overflow",              type: "overflow-menu",    overflow_items: [
                                                                {text: "Assign All", action: () => {assignAllAction()}}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
                                                                {text: "Delete All", action: () => {deleteAllAction()}}
                                                               ]
    }
  ]);

  const [streetColumnNames, setStreetColumnNames] = useState([
    {field: "selectbox",             type: "selectbox",        html_text: "", selected_items: []},
    {field: "name",                  type: "text",             html_text: "Name"},
    {field: "assignment_status",     type: "text",             html_text: "Assignment Status"},
    {field: "months_since_assigned", type: "text",             html_text: "Months Since Last Assigned"},
    {field: "amount_collected",      type: "text",             html_text: "Previous Canning Donations"},
    {field: "outreach_pct",          type: "text",             html_text: "Wants to Learn More"},
    {field: "soliciting_pct",        type: "text",             html_text: "Allows Soliciting"},
    {field: "overflow",              type: "overflow-menu",    overflow_items: [
                                                                {text: "Assign All", action: () => {assignAllAction()}}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
                                                                {text: "Delete All", action: () => {deleteAllAction()}}
                                                              ]}

  ]);

  // ===========================================================================
  //                        Overflow Action Methods
  // ===========================================================================
  const editRouteAction  = (route_id) => {
    console.log("editing route id: " + route_id);
  }
  const assignRouteAction = () => {
    console.log("assigning route");
  }
  const housePropertiesAction = () => {
    console.log("house properties");
  }
  const revisionHistoryAction = () => {
    console.log("revision history");
  }
  const deleteRouteAction = (route_id) => {
    console.log("deleting route id: " + route_id);
  }
  // These ones are used by the overflow in the column header
  const assignAllAction = () => {
    console.log("Assigning all routes");
  }
  const deleteAllAction = () => {
    console.log("Deleting all routes");
  }

  // ===========================================================================
  //                        Callback Methods for Props
  // ===========================================================================

  // A function which sends a GET request to firebase for a filtered result set of Routes. This function is used by a searchBar.
  const searchRoutes = (query_string) => {
    let new_query = Object.assign({}, queryState, {queryString: query_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  // This function is passed to a ResourceIndexTable, which will then pass it to the table's child ResourceIndexItems. When an item's row in the html table is selected,
  // its ID will be added to the state object for selected resources
  const selectRoute = (event, route_key) => {
    const selected = routeColumnNames[0].selected_items;
    const selectedIndex = selected.indexOf(route_key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, route_key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    let n = deepCopyFunction(routeColumnNames);
    n[0] = Object.assign({}, n[0], {selected_items: newSelected});
    setRouteColumnNames(n);
  }

  // Does the same as selectRoute, but applies to the selectAllResources state object instead
  const selectAllRoutes = (event) => {
    const selected = routeColumnNames[0].selected_items
    let c = deepCopyFunction(routeColumnNames);
    if (event.target.checked) {
      const newSelected = routes.map((n) => n.name);
      c[0] = Object.assign({}, c[0], {selected_items: newSelected});
    } else {
      c[0] = Object.assign({}, c[0], {selected_items: []});
    }
    setRouteColumnNames(c);
  }

  const selectStreet = (event, column, street_data) => {
    const street_key = street_data.name;
    const selected = streetColumnNames[0].selected_items;
    const selectedIndex = selected.indexOf(street_key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, street_key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    let n = deepCopyFunction(streetColumnNames);
    n[0] = Object.assign({}, n[0], {selected_items: newSelected});
    setStreetColumnNames(n);
    forceUpdate();
    console.log(n[0]);
  }

  const selectAllStreets = (event, data) => {
    const selected = streetColumnNames[0].selected_items
    let c = deepCopyFunction(streetColumnNames);
    if (event.target.checked) {
      c[0] = Object.assign({}, c[0], {selected_items: data});
    } else {
      c[0] = Object.assign({}, c[0], {selected_items: []});
    }
    setStreetColumnNames(c);
  }

  // Uses the string of a column title to alter the routes query
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, {sort: column_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  // Takes raw_routes returned from database, and performs necessary calculations and applies transformations/validations required by ResourceIndexTable.
  const tableTransform = (raw_routes) => {
    let tabled_routes = [];
    for(let i = 0; i < raw_routes.length; i++){
      let months_since_assigned, total_donations, street_contents;
      // for now, we need this to validate each route
      if(raw_routes[i].name){
        if(raw_routes[i].canningData){
          if(raw_routes[i].canningData.lastCanned){
            // Example calculation for months_since_assigned
            let now = new Date();
            let last_assigned = new Date(raw_routes[i].canningData.lastCanned.toDate());
            let years_since_assigned = now.getFullYear() - last_assigned.getFullYear();
            months_since_assigned = ((years_since_assigned * 12) + (now.getMonth() - last_assigned.getMonth())).toString();
          }
          if(raw_routes[i].canningData.totalDonations){
              total_donations = "$" + (raw_routes[i].canningData.totalDonations.toString() || "0");
          } else {
            months_since_assigned = "N/A";
            total_donations = "N/A";
          }
        }
        if(raw_routes[i].streets){

        }
          street_contents = <Box margin={1}>
                              <ResourceIndexTable
                                selectableItemHandler={selectStreet}
                                selectableColumnHandler={(event) => {selectAllStreets(event, ["Easy St", "Hard Knocks Alley"])}}
                                items={[
                                  {route: "R17", name: "Easy St", amount_collected: "$1M", assignment_status: "", months_since_assigned: "", outreach_pct: "98%", soliciting_pct: "99%", overflow: {overflow_items: [{text: "Edit", action: () => editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                                              {text: "Assign", action: assignRouteAction},
                                                              {text: "House Properties", action: housePropertiesAction},
                                                              {text: "Revision History", action: revisionHistoryAction},
                                                              {text: "Delete", action: () => deleteRouteAction(raw_routes[i].name)}
                                                            ]}},
                                  {route: "R17", name: "Hard Knocks Alley", amount_collected: "$3.50", assignment_status: "", months_since_assigned: "", outreach_pct: "2%", soliciting_pct: "1%", overflow: {overflow_items: [{text: "Edit", action: () => editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                                              {text: "Assign", action: assignRouteAction},
                                                              {text: "House Properties", action: housePropertiesAction},
                                                              {text: "Revision History", action: revisionHistoryAction},
                                                              {text: "Delete", action: () => deleteRouteAction(raw_routes[i].name)}
                                                            ]}}
                                ]}
                                columns={streetColumnNames}
                                />
                            </Box>;
          tabled_routes.push({
            selectbox: {},
            streets: ["Easy St", "Hard Knocks Alley"],
            drop_down: {open: false, contents: street_contents},
            name: raw_routes[i].name,
            assignment_status: raw_routes[i].assignmentStatus ? raw_routes[i].assignmentStatus.toString() : "",
            months_since_assigned: months_since_assigned.toString(),
            amount_collected: total_donations,
            household_avg: null,
            outreach_pct: null,
            soliciting_pct: null,
            overflow: {overflow_items: [{text: "Edit", action: () => editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                        {text: "Assign", action: assignRouteAction},
                                        {text: "House Properties", action: housePropertiesAction},
                                        {text: "Revision History", action: revisionHistoryAction},
                                        {text: "Delete", action: () => deleteRouteAction(raw_routes[i].name)}
                                      ]}
          });
        }
      }
    return tabled_routes;
  }

  // This is the function which will be passed as a prop eventually to index items.
  // Requires cases for each of the different selectable columns
  const selectableItemCallbacksHandler = (event, column, data) => {
    let fn;
    switch(column.field){
      case 'selectbox':
        fn = () => {selectRoute(event, data.name)};
        break;
    }
    fn();
  }

  // Similar to above, but handles the click events for column headers instead of index items
  const selectableHeaderCallbacksHandler = (event, column) => {
    let fn;
    switch(column.type){
      case 'selectbox':
        fn = () => {selectAllRoutes(event)};
        break;
      case 'overflow-menu':
        fn = () => {console.log('overflow has been clicked')};
        break;
      case 'text':
        fn = () => {sortRoutes(column.field)};
        break;
      default:
        fn = () => {console.log('default route was clicked')};
    }
    fn();
  }

  const newRoute = () => {
    console.log("Creating a new route!");
  }

  useEffect(() => {
    db.collection('tempRoutes').onSnapshot(snapshot => {
      const allRoutes = snapshot.docs.map((route) => ({
        ...route.data()
      }));
      setRoutes(tableTransform(allRoutes));
    });
  }, []);

  let screen;

  if(routes){
    screen = <div className="panel-screen">
                <RouteMetrics metrics={routeMetrics}/>
                <br/>
                <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <SearchBar queryCallback={searchRoutes}/>
                  <AddButton clickCallback={newRoute} route={ROUTES.ADMIN_ROUTES_NEW}/>
                </div>
                <ResourceIndexTable
                    items={routes} // we use the raw data received in routes, but first we use this function to validate, calculate and truncate/simplify it. This may be inefficient
                    columns={routeColumnNames}
                    selectableItemHandler={selectableItemCallbacksHandler}
                    selectableColumnHandler={selectableHeaderCallbacksHandler}
                />
             </div>;
  } else {
    screen = <div className="panel-screen">
                <ZeroResource name="routes" msg="Create routes to assign volunteers"/>
             </div>;
  }

  return(
    <div>
      <PanelBanner title="Routes"/>
      {screen}
      <ul>
        <li><Link to={ROUTES.ASSIGN_ROUTE}>Assign Route</Link></li>
      </ul>
      <ul>
        <li><Link to={ROUTES.EDIT_ROUTE}>Edit Route</Link></li>
      </ul>
    </div>
  );
};

export default RoutesPanel;
