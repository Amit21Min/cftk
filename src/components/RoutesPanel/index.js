import React, {useState, useEffect} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import SearchBar from '../SearchBar';
import AddButton from '../AddButton';
import ResourceIndexTable from '../ResourceIndexTable';
import PanelBanner from '../PanelBanner';
import { db } from '../Firebase/firebase';

import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import "./index.css";


const RoutesPanel = () => {
  const [routes, setRoutes] = useState(null);
  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });

  // These state objects are used to keep track of which items within the ResourceIndexTable are selected (in order to perform bulk delete/update operations)
  const [selectedResources, setSelectedResources] = useState([]);

  // This state object will be used to construct GET requests to our Routes resource. Takes a query string for text search, and a sort option.
  const [queryState, setQueryState] = useState({sort: false, queryString: ""});

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

  // This is used by a ResourceIndexTable to define the column names of an html table, as well as to fit the data from each row into the appropriate column.
  // Provides its keys to resourceIndexItem(s) to be used as accessors to correctly match data to html table columns. The string per key is the text which is displayed as the html table column headers
  const [routeColumnNames, setRouteColumnNames] = useState([
    {field: "selectbox",             type: "selectbox",        html_text: ""},
    {field: "drop_down",             type: "drop-down-parent", html_text: ""},
    {field: "name",                  type: "text",             html_text: "Name"},
    {field: "assignment_status",     type: "text",             html_text: "Assignment Status"},
    {field: "months_since_assigned", type: "text",             html_text: "Months Since Last Assigned"},
    {field: "amount_collected",      type: "text",             html_text: "Previous Canning Donations"},
    {field: "outreach_pct",          type: "text",             html_text: "Wants to Learn More"},
    {field: "soliciting_pct",        type: "text",             html_text: "Allows Soliciting"},
    {field: "overflow",              type: "overflow-menu",    overflow_items: [
                                                                {text: "Assign All", action: assignAllAction}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
                                                                {text: "Delete All", action: deleteAllAction}
                                                               ]
    }
  ]);

  // ===========================================================================
  //                        Callback Methods for Props
  // ===========================================================================

  // A function which sends a GET request to firebase for a filtered result set of Routes. This function is used by a searchBar.
  const searchRoutes = (query_string) => {
    let new_query = Object.assign({}, queryState, {queryString: query_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  // Is passed to ResourceIndexTable, which passes it to, and handles click events for, ResourceIndexTableHeaders.
  // Expects a .type within the arg object to tell it what operation to perform.
  const selectColumnHandler = (event, column_message) => {
      switch(column_message.type){
        case "select-all":
          selectAllRoutes(event);
          break;
        default:
          sortRoutes(column_message.query_string);
      }
  }

  // This function is passed to a ResourceIndexTable, which will then pass it to the table's child ResourceIndexItems. When an item's row in the html table is selected,
  // its ID will be added to the state object for selected resources
  const selectRoute = (event, route_key) => {
    const selectedIndex = selectedResources.indexOf(route_key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedResources, route_key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedResources.slice(1));
    } else if (selectedIndex === selectedResources.length - 1) {
      newSelected = newSelected.concat(selectedResources.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedResources.slice(0, selectedIndex),
        selectedResources.slice(selectedIndex + 1),
      );
    }
    setSelectedResources(newSelected);
  }

  // Does the same as selectRoute, but applies to the selectAllResources state object instead
  const selectAllRoutes = (event) => {
    if (event.target.checked) {
      const newSelected = routes.map((n) => n.name);
      setSelectedResources(newSelected);
      return;
    }
    setSelectedResources([]);
  }

  // Uses the string of a column title to alter the routes query
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, {sort: column_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  const expandParentHandler = () => {

  }

  // Takes routes returned from database, and performs necessary calculations and applies transformations/validations required by ResourceIndexTable.
  const tableTransform = (routes) => {
    console.log(routes);
    let tabled_routes = [];
    for(let i = 0; i < routes.length; i++){
      let months_since_assigned;
      let total_donations;
      // for now, we need this to validate each route
      if(routes[i].name){
        if(routes[i].canningData){
          if(routes[i].canningData.lastCanned){
            // Example calculation for months_since_assigned
            let now = new Date();
            let last_assigned = new Date(routes[i].canningData.lastCanned.toDate());
            let years_since_assigned = now.getFullYear() - last_assigned.getFullYear();
            months_since_assigned = ((years_since_assigned * 12) + (now.getMonth() - last_assigned.getMonth())).toString();
          }
          if(routes[i].canningData.totalDonations){
              total_donations = "$" + (routes[i].canningData.totalDonations.toString() || "0");
          } else {
            months_since_assigned = "N/A";
            total_donations = "N/A";
          }
        }
          tabled_routes.push({
            drop_down: {open: false},
            name: routes[i].name,
            assignment_status: routes[i].assignmentStatus ? routes[i].assignmentStatus.toString() : "",
            months_since_assigned: months_since_assigned.toString(),
            amount_collected: total_donations,
            household_avg: null,
            outreach_pct: null,
            soliciting_pct: null,
            overflow: {overflow_items: [{text: "Edit", action: () => editRouteAction(routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                        {text: "Assign", action: assignRouteAction},
                                        {text: "House Properties", action: housePropertiesAction},
                                        {text: "Revision History", action: revisionHistoryAction},
                                        {text: "Delete", action: () => deleteRouteAction(routes[i].name)}
                                      ]}
          });
        }
      }
      console.log(tabled_routes);
    return tabled_routes;
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
                    selectedItems={selectedResources}
                    allSelected={routes.length > 0 && selectedResources.length === routes.length}
                    selectItemCallback={selectRoute}
                    selectColumnCallback={selectColumnHandler}
                    expandParentCallback={expandParentHandler}
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
