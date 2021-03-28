import React, {useState, useEffect} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../../../ReusableComponents/ZeroResource';
import SearchBar from '../../SearchBar';
import AddButton from '../../../ReusableComponents/AddButton';
import ResourceIndexTable from '../ResourceIndexTable';

import PanelBanner from '../PanelBanner';

import AssignRoute from '../../AssignRoute';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import Box from '@material-ui/core/Box';
import { db } from '../../../FirebaseComponents/Firebase/firebase';

import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

import "./index.css";
import * as overflow_actions from './overflow_actions.js';
import * as helpers from './helpers.js';

// These contexts allow for updating/re-rendering dynamically nested components, namely, the street tables nested within the route tables
import {RouteColumnContext, RouteItemsContext,
        StreetColumnContext, StreetItemsContext,
        init_route_columns, init_street_columns
       } from './contexts.js';


const RoutesPanel = () => {
  const [routes, setRoutes] = useState(null);

  const [routeMetrics, setRouteMetrics] = useState({ // hook up to firebase
    total_assigned: 0,
    ready_to_be_assigned: 0,
    donations_last_event: "$0",
    delta_from_last_canning: "$0"
  });

  const findRouteStatistics = async function() {
    let assignedCounter = 0;
    let readyAssignCounter = 0;
    db.collection("Routes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if (doc.data().assignmentStatus === true) {
            assignedCounter++;
          }

          else {
            readyAssignCounter++;
          }
      });

      let newRouteMetrics = Object.assign(routeMetrics, 
        { 
          total_assigned: assignedCounter,
          ready_to_be_assigned: readyAssignCounter,
        }
      )
      setRouteMetrics(
        {
          total_assigned: newRouteMetrics.total_assigned,
          ready_to_be_assigned: newRouteMetrics.ready_to_be_assigned,
          donations_last_event: newRouteMetrics.donations_last_event,
          delta_from_last_canning: newRouteMetrics.delta_from_last_canning
        }
      );
    });
  }

  const findDonorStatistics = async function() {
    let eventDonationAmount = 0;
    let latestDate = "01-01-1800";
    db.collection('RoutesComplete').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (Date.parse(latestDate) < Date.parse(doc.data().visitDate)) {
          latestDate = doc.data().visitDate;
        }
      });

      querySnapshot.forEach((doc) => { // left off here
        if (doc.data().visitDate === latestDate) {

          //console.log(doc.data().streets);
          for (const [key, value] of Object.entries(doc.data().streets)) { //gets each street (key) and array of houses objects (value)
            // console.log(value[0]['104'].donationAmt);
            for (let i = 0; i < value.length; i++) { //loops through array of house objects
              let houseObjects = Object.keys(value[i]); // gets the key (1) of each house object
              for (let j = 0; j < houseObjects.length; j++) {
                if (value[i][houseObjects[j]].donationAmt != null) {
                  eventDonationAmount += value[i][houseObjects[j]].donationAmt; //add donation amount
                  // console.log(eventDonationAmount);
                }
       
              }
            }
          } 
        }
      });
      let newRouteMetrics = Object.assign(routeMetrics, 
        { 
          donations_last_event: `$${eventDonationAmount}`,
        }
      )
      setRouteMetrics(
        {
          total_assigned: newRouteMetrics.total_assigned,
          ready_to_be_assigned: newRouteMetrics.ready_to_be_assigned,
          donations_last_event: newRouteMetrics.donations_last_event,
          delta_from_last_canning: newRouteMetrics.delta_from_last_canning
        }
      );
    });
  }

  useEffect(function() {
    findRouteStatistics();
  }, []);

  useEffect(function() {
    findDonorStatistics();
  }, []);

  // This state object will be used to construct GET requests to our Routes resource. Takes a query string for text search, and a sort option.
  const [queryState, setQueryState] = useState({sort: false, queryString: ""});

  // This is used by a ResourceIndexTable to define the column names of an html table, as well as to fit the data from each row into the appropriate column.
  // Provides its keys to resourceIndexItem(s) to be used as accessors to correctly match data to html table columns.
  const [streetItems, setStreetItems]             = useState([]);
  const [routeColumnNames, setRouteColumnNames]   = useState(init_route_columns);
  const [streetColumnNames, setStreetColumnNames] = useState(init_street_columns);

  // ===========================================================================
  //                        Callback Methods for Props
  // ===========================================================================

  // A function which sends a GET request to firebase for a filtered result set of Routes. This function is used by a searchBar.
  const searchRoutes = (query_string) => {
    let new_query = helpers.deepCopyFunction(queryState);
    new_query.queryString = query_string;
    setQueryState(new_query);
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

    let n = helpers.deepCopyFunction(routeColumnNames);
    n[0] = Object.assign({}, n[0], {selected_items: newSelected});
    setRouteColumnNames(n);

  }

  // Does the same as selectRoute, but adds every available route id to the list of selected items
  const selectAllRoutes = (event) => {
    let c = helpers.deepCopyFunction(routeColumnNames);
    if (event.target.checked) {
      const newSelected = routes.map((n) => n.name);
      c[0] = Object.assign({}, c[0], {selected_items: newSelected});
    } else {
      c[0] = Object.assign({}, c[0], {selected_items: []});
    }
    setRouteColumnNames(c);
  }

  // Does the same as selectRoute, but for the streets contained within Routes. This function is used by the ResourceIndexTable for streets which is nested
   // within the routes ResourceIndexTable
  const selectStreet = (event, column, street_data) => {
    const street_key = street_data.name;
    const selected = column.selected_items;
    const selectedIndex = selected.indexOf(street_key);
    let newSelected = [];
    // console.log(selected);
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

    let n = helpers.deepCopyFunction(streetColumnNames);
    n[0] = Object.assign({}, n[0], {selected_items: newSelected});
    setStreetColumnNames(n);
  }

  // Same as selectAllRoutes, but for streets
  const selectAllStreets = (event, data) => {
    let c = helpers.deepCopyFunction(streetColumnNames);
    if (event.target.checked) {
      c[0] = Object.assign({}, c[0], {selected_items: data});
    } else {
      c[0] = Object.assign({}, c[0], {selected_items: []});
    }
    setStreetColumnNames(c);
  }

  // Uses the string of a column title to alter the routes query. When the routes query state object updates, a new request should be sent to firebase based on the params it specifies
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, {sort: column_string});
    setQueryState(new_query);
  }

  // ============================================================================
  //               Handler Methods which dispatch callback methods
  // ============================================================================
  // These methods are required by ResourceIndexTables, and are responsible for correctly matching the user behavior (clicks on columns or rows) with desired functionality

  // This is the function which will be passed as a prop eventually to index items (the rows within a table).
  // Requires cases for each of the different types of selectable columns
  const selectableItemCallbacksHandler = (event, column, data) => {
    let fn;
    switch(column.type){
      case 'selectbox':
        fn = () => {selectRoute(event, data.name)};
        break;
      default:
        fn = () => {return true};
    }
    fn();
  }

  // Similar to above, but handles the click events for column headers instead of index items. This is where table sorting based on columns can be implemented.
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

  const routeHistory = async function(lastRoute) {
    var date;
    const routeRef = await db.collection('RouteHistory').doc('R17_12345').get();
    // console.log(routeRef.data());
    // routeRef.get().then(function(doc) {
    //   if (doc.exists) {
    //     console.log(doc.data().visitDate)
    //     date = doc.data().visitDate;
    //   } else {
    //     return 'failed to fetch';
    //   }
    // });
    // console.log('hello3', date);
    // return date;
  }
  // ===========================================================================
  //                                 Data Transformation
  // ===========================================================================
  // Takes raw_routes returned from database, and performs necessary calculations and applies transformations/validations required by ResourceIndexTable.
  // This also pre-constructs all of the components used by the ResourceIndexTable, for example, each route will generate a ResourceIndexTable for its child streets to be rendered within each ResourceIndexItem
  const tableTransform = (raw_routes) => {
    let tabled_routes = [];
    for(let i = 0; i < raw_routes.length; i++){
      let data = raw_routes[i];
      // console.log(data);

      let name, assignment_status, months_since_assigned, total_donations, soliciting_pct, interest_pct, lastVisitDate;
      name = data.routeName;
      if (data.assignmentStatus) {
        assignment_status = "Assigned";
      } else {
        assignment_status = "Unassigned";
      }
      // if (data.assignmentDates.length >= 1) {
      //   var lastRoute = data.assignmentDates[data.assignmentDates.length - 1];
      //   console.log(lastRoute);
      //   if (typeof lastRoute !== 'undefined') {
      //     lastVisitDate = routeHistory(lastRoute);
      //   }
      // }
      

      total_donations = data.total; // TODO: CREATE A SUM OF TOTAL DONATIONS

      interest_pct = data.perInterest;
      soliciting_pct = data.perSoliciting;


      if (typeof months_since_assigned == 'undefined') {
        months_since_assigned = "No History";
      }
      if (typeof totaldonations == 'undefined') {
        total_donations = "No History";
      }
      if (typeof interest_pct == 'undefined') {
        interest_pct = "No History";
      }
      if (typeof soliciting_pct == 'undefined') {
        soliciting_pct = "No History";
      }

        // Defines the ResourceIndexTable for streets that will be nested within the "drop_down" key within the ResourceIndexItem for each route
        // Right now this is hardcoded as an example while the data model for streets is worked out.
      var street_contents =
                            <StreetColumnContext.Consumer>
                            {columns => (
                              <StreetItemsContext.Consumer>
                                {items => (
                                  <ResourceIndexTable
                                    selectableItemHandler={selectStreet}
                                    selectableColumnHandler={(event) => {selectAllStreets(event, ["Easy St", "Hard Knocks Alley"])}}
                                    items={[
                                      {route: "R17", name: "Easy St", amount_collected: "$1M", assignment_status: "", months_since_assigned: "", outreach_pct: "98%", soliciting_pct: "99%", overflow: {overflow_items: [{text: "Edit", action: () => overflow_actions.editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                                                  {text: "Assign",           action: assignRouteAction},
                                                                  {text: "House Properties", action: overflow_actions.housePropertiesAction},
                                                                  {text: "Revision History", action: overflow_actions.revisionHistoryAction},
                                                                  {text: "Delete",           action: () => overflow_actions.deleteRouteAction(raw_routes[i].name)}
                                                                ]}},
                                      {route: "R17", name: "Hard Knocks Alley", amount_collected: "$3.50", assignment_status: "", months_since_assigned: "", outreach_pct: "2%", soliciting_pct: "1%", overflow: {overflow_items: [{text: "Edit", action: () => overflow_actions.editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                                                  {text: "Assign",           action: assignRouteAction},
                                                                  {text: "House Properties", action: overflow_actions.housePropertiesAction},
                                                                  {text: "Revision History", action: overflow_actions.revisionHistoryAction},
                                                                  {text: "Delete",           action: () => overflow_actions.deleteRouteAction(raw_routes[i].name)}
                                                                ]}}
                                    ]}
                                    columns={columns}
                                  />
                                )}
                              </StreetItemsContext.Consumer>
                            )}
                          </StreetColumnContext.Consumer>

      tabled_routes.push({
        selectbox: {},
        streets: ["Easy St", "Hard Knocks Alley"],
        drop_down: {open: false, contentsType: 'raw', contents: street_contents},
        name: data.routeName,
        assignment_status: data.assignmentStatus ? data.assignmentStatus.toString() : assignment_status,
        months_since_assigned: months_since_assigned.toString(),
        amount_collected: null,
        household_avg: null,
        outreach_pct: interest_pct,
        soliciting_pct: soliciting_pct,
        // This is where the object for OverflowMenu's is defined. This object is parsed by a ResourceIndexItem to generate the OverflowMenu. This is where the actions for the menu options should be attached.
        overflow: {overflow_items: [{text: "Edit",             action: () => overflow_actions.editRouteAction(data.routeName)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
                                    {text: "Assign",           action: () => assignRouteAction(data.routeName)},
                                    {text: "Unassign",         action: () => overflow_actions.unassignRouteAction(data.routeName)},
                                    {text: "House Properties", action: overflow_actions.housePropertiesAction},
                                    {text: "Revision History", action: overflow_actions.revisionHistoryAction},
                                    {text: "Delete",           action: () => overflow_actions.deleteRouteAction(raw_routes[i].name)}
                                  ],
                  hidden: true
                  }
      });
    }

    return tabled_routes;
  }

  const newRoute = () => {
    console.log("Creating a new route!");
  }

  useEffect(() => {
    db.collection('Routes').onSnapshot(snapshot => {
      const allRoutes = snapshot.docs.map((route) => {
        // TODO - fetch route visit date
        return({
          ...(route.data()),
          routeName: route.id
        })
      });
      // console.log(allRoutes);

    
      // const routeRef = db.collection('RouteHistory').doc("R17");
      // var visitDate;
      // routeRef.get().then(function(doc) {
      //   if (doc.exists) {
      //     console.log(doc.data().visitDate)
      //     visitDate = doc.data().visitDate;
      //   } else {
      //     console.log('failed to fetch');
      //   }
      //   console.log(visitDate);
      // });

      setRoutes(tableTransform(allRoutes));
    });
  }, []);

  let screen;

  if(routes){
    screen = <div className="panel-screen">
                <RouteMetrics metrics={routeMetrics}/>
                <br/>
                <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <SearchBar passedValue={queryState.queryString} queryCallback={searchRoutes}/>
                  <AddButton clickCallback={newRoute} route={ROUTES.ADMIN_ROUTES_NEW}/>
                </div>
                <StreetColumnContext.Provider value={streetColumnNames}>
                  <StreetItemsContext.Provider value={streetItems}>
                    <RouteColumnContext.Consumer>
                      {columns => (
                        <RouteItemsContext.Consumer>
                          {routes => (
                            <ResourceIndexTable
                                items={routes}
                                columns={columns}
                                selectableItemHandler={selectableItemCallbacksHandler}
                                selectableColumnHandler={selectableHeaderCallbacksHandler}
                            />
                          )}
                        </RouteItemsContext.Consumer>
                      )}
                    </RouteColumnContext.Consumer>
                  </StreetItemsContext.Provider>
                </StreetColumnContext.Provider>
             </div>;
  } else {
    screen = <div className="panel-screen">
                <ZeroResource name="routes" msg="Create routes to assign volunteers"/>
             </div>;
  }

  // ===========================================================================
  //                        Open Assign Route Dialog
  // ===========================================================================
  const [route, setRoute] = React.useState(""); // string - the route to be assigned
  const [open, setOpen] = React.useState(false); // true/false: dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const assignRouteAction = (routeName) => {
    // console.log("assigning route:", routeName);
    setRoute(routeName);
    handleClickOpen();
  }
  // TODO: Show a success snackbar after assigning successfully
  // ===========================================================================

  return(
    <div className="container">
      <PanelBanner title="Routes"/>
      <RouteColumnContext.Provider value={routeColumnNames}>
        <RouteItemsContext.Provider value={routes}>
          {screen}
        </RouteItemsContext.Provider>
      </RouteColumnContext.Provider>
      <ul>
        {/* <li><Link to={ROUTES.ASSIGN_ROUTE}>Assign Route</Link></li> */}
      </ul>
      <ul>
        <li><Link to={ROUTES.ADMIN_ROUTES_EDIT}>Edit Route</Link></li>
      </ul>

      {/* assign route dialog */}
      <div>
        <Button color="primary" onClick={handleClickOpen}>
          Assign Route
        </Button>
        <Dialog aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}
          open={open} onClose={handleClose}>
          <AssignRoute routes={route} close={handleClose}/>
        </Dialog>
        {/* TODO: Show a success snackbar after assigning successfully */}
      </div>
    </div>
  );


};
export default RoutesPanel;
