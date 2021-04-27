import React, { useState, useEffect } from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../../../ReusableComponents/ZeroResource';
import SearchBar from '../../SearchBar';
import ResourceIndexTable from '../ResourceIndexTable';

import PanelBanner from '../PanelBanner';

import AssignRoute from '../../AssignRoute';
import Dialog from '@material-ui/core/Dialog';
// import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab'

import { db } from '../../../FirebaseComponents/Firebase/firebase';

import { Link, useHistory } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

import "./index.css";
import * as overflow_actions from './overflow_actions.js';
import * as helpers from './helpers.js';

// These contexts allow for updating/re-rendering dynamically nested components, namely, the street tables nested within the route tables
import {
  RouteColumnContext, RouteItemsContext,
  StreetColumnContext, StreetItemsContext,
  init_route_columns, init_street_columns
} from './contexts.js';
import TitleCard from '../../../ReusableComponents/TitleCard';

const RoutesPanel = (props) => {
  const [routes, setRoutes] = useState(null);

  const [routeMetrics, setRouteMetrics] = useState({ // hook up to firebase
    total_assigned: 0,
    ready_to_be_assigned: 0,
    donations_last_event: "$0",
    delta_from_last_canning: "$0"
  });

  const findRouteStatistics = async function () {
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

  const findDonorStatistics = async function () {
    let eventDonationAmount = 0;
    let latestDate = "01-01-1800";
    let yearDonationAmount = 0;
    db.collection('RoutesComplete').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (Date.parse(latestDate) < Date.parse(doc.data().visitDate)) {
          latestDate = doc.data().visitDate;
        }
      });
      let currentDateFormat = Date.parse(latestDate);
      querySnapshot.forEach((doc) => { // left off here
        let eventDateFormat = Date.parse(doc.data().visitDate)
        let diff = (eventDateFormat - currentDateFormat) / (1000 * 60 * 60 * 24);
        if (diff <= 365) {
          for (const [key, value] of Object.entries(doc.data().streets)) { //gets each street (key) and array of houses objects (value)
            // console.log(value[0]['104'].donationAmt);
            for (let i = 0; i < value.length; i++) { //loops through array of house objects
              let houseObjects = Object.keys(value[i]); // gets the key (1) of each house object
              for (let j = 0; j < houseObjects.length; j++) {
                if (value[i][houseObjects[j]].donationAmt != null) {
                  yearDonationAmount += value[i][houseObjects[j]].donationAmt; //add donation amount
                  // console.log(eventDonationAmount);
                }

              }
            }
          }

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
        }

      });
      console.log(yearDonationAmount)
      let newRouteMetrics = Object.assign(routeMetrics,
        {
          donations_last_event: `$${eventDonationAmount}`,
          donations_from_year: `$${yearDonationAmount}`
        }
      )
      setRouteMetrics(
        {
          total_assigned: newRouteMetrics.total_assigned,
          ready_to_be_assigned: newRouteMetrics.ready_to_be_assigned,
          donations_last_event: newRouteMetrics.donations_last_event,
          donations_from_year: newRouteMetrics.donations_from_year,
        }
      );
    });
  }

  useEffect(function () {
    findRouteStatistics();
  }, []);

  useEffect(function () {
    findDonorStatistics();
  }, []);

  // This state object will be used to construct GET requests to our Routes resource. Takes a query string for text search, and a sort option.
  const [queryState, setQueryState] = useState({ sort: false, queryString: "" });

  // This is used by a ResourceIndexTable to define the column names of an html table, as well as to fit the data from each row into the appropriate column.
  // Provides its keys to resourceIndexItem(s) to be used as accessors to correctly match data to html table columns.
  const [streetItems, setStreetItems] = useState([]);
  const [routeColumnNames, setRouteColumnNames] = useState(init_route_columns);
  const [streetColumnNames, setStreetColumnNames] = useState(init_street_columns);
  const history = useHistory()

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
    n[0] = Object.assign({}, n[0], { selected_items: newSelected });
    setRouteColumnNames(n);

  }

  // Does the same as selectRoute, but adds every available route id to the list of selected items
  const selectAllRoutes = (event) => {
    let c = helpers.deepCopyFunction(routeColumnNames);
    if (event.target.checked) {
      const newSelected = routes.map((n) => n.name);
      c[0] = Object.assign({}, c[0], { selected_items: newSelected });
    } else {
      c[0] = Object.assign({}, c[0], { selected_items: [] });
    }
    setRouteColumnNames(c);
  }

  // Does the same as selectRoute, but for the streets contained within Routes. This function is used by the ResourceIndexTable for streets which is nested
  // within the routes ResourceIndexTable
  // const selectStreet = (event, column, street_data) => {
  //   const street_key = street_data.name;
  //   const selected = column.selected_items;
  //   const selectedIndex = selected.indexOf(street_key);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, street_key);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   let n = helpers.deepCopyFunction(streetColumnNames);
  //   n[0] = Object.assign({}, n[0], { selected_items: newSelected });
  //   setStreetColumnNames(n);
  // }

  // Same as selectAllRoutes, but for streets
  // const selectAllStreets = (event, data) => {
  //   let c = helpers.deepCopyFunction(streetColumnNames);
  //   if (event.target.checked) {
  //     c[0] = Object.assign({}, c[0], { selected_items: data });
  //   } else {
  //     c[0] = Object.assign({}, c[0], { selected_items: [] });
  //   }
  //   setStreetColumnNames(c);
  // }

  // Uses the string of a column title to alter the routes query. When the routes query state object updates, a new request should be sent to firebase based on the params it specifies
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, { sort: column_string });
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
    switch (column.type) {
      case 'selectbox':
        fn = () => { selectRoute(event, data.name) };
        break;
      default:
        fn = () => { return true };
    }
    fn();
  }

  // Similar to above, but handles the click events for column headers instead of index items. This is where table sorting based on columns can be implemented.
  const selectableHeaderCallbacksHandler = (event, column) => {
    let fn;
    switch (column.type) {
      case 'selectbox':
        fn = () => { selectAllRoutes(event) };
        break;
      case 'overflow-menu':
        fn = () => { console.log('overflow has been clicked') };
        break;
      case 'text':
        fn = () => { sortRoutes(column.field) };
        break;
      default:
        fn = () => { console.log('default route was clicked') };
    }
    fn();
  }


  // ===========================================================================
  //                                 Data Transformation
  // ===========================================================================
  // Takes raw_routes returned from database, and performs necessary calculations and applies transformations/validations required by ResourceIndexTable.
  // This also pre-constructs all of the components used by the ResourceIndexTable, for example, each route will generate a ResourceIndexTable for its child streets to be rendered within each ResourceIndexItem
  const tableTransform = (raw_routes, streetData) => {
    let tabled_routes = [];
    for (let i = 0; i < raw_routes.length; i++) {
      let data = raw_routes[i];

      let name, assignment_status, months_since_assigned, amount_collected, soliciting_pct, interest_pct, lastVisitDate;
      name = data.routeName;
      if (data.assignmentStatus) {
        assignment_status = "Assigned";
      } else {
        assignment_status = "Unassigned";
      }


      amount_collected = data.total; // TODO: CREATE A SUM OF TOTAL DONATIONS

      interest_pct = data.perInterest;
      soliciting_pct = data.perSoliciting;


      if (typeof months_since_assigned == 'undefined') {
        months_since_assigned = "No History";
      }
      if (typeof amount_collected == 'undefined') {
        amount_collected = "No History";
      }

      var streets = [];
      for (var x in streetData) {
        if (data.streets.includes(Object.keys(streetData[x])[0])) {
          streets.push(streetData[x]);
        }
      }

      var solicitSum = 0;
      var outreachSum = 0;

      var streetItems = [];
      streets.forEach((street) => {
        var streetName = Object.keys(street)[0].split("_")[0];
        var amount_collected = street[Object.keys(street)[0]].total.toString();
        var soliciting_pct = street[Object.keys(street)[0]].perSoliciting.toString();
        var outreach_pct = street[Object.keys(street)[0]].perInterest.toString();
        solicitSum += parseFloat(soliciting_pct);
        outreachSum += parseFloat(outreach_pct);

        console.log(queryState);

        streetItems.push(
          { route: name, name: streetName, amount_collected, assignment_status: "", months_since_assigned: "", outreach_pct, soliciting_pct }
        )
      });

      var solicitAvg = solicitSum / streets.length;
      var outreachAvg = outreachSum / streets.length;

      // console.log(streetItems);

      // Defines the ResourceIndexTable for streets that will be nested within the "drop_down" key within the ResourceIndexItem for each route
      const street_contents =
        <StreetColumnContext.Consumer>
          {columns => (
            <StreetItemsContext.Consumer>
              {items => (
                <ResourceIndexTable
                  // selectableItemHandler={selectStreet}
                  // selectableColumnHandler={(event) => {selectAllStreets(event, ["Easy St", "Hard Knocks Alley"])}}
                  items={streetItems}
                  columns={columns}
                />
              )}
            </StreetItemsContext.Consumer>
          )}
        </StreetColumnContext.Consumer>


      tabled_routes.push({
        selectbox: {},
        drop_down: { open: false, contentsType: 'raw', contents: street_contents },
        name: data.routeName,
        assignment_status: data.assignmentStatus ? data.assignmentStatus.toString() : assignment_status,
        months_since_assigned: months_since_assigned.toString(),
        amount_collected: amount_collected.toString(),
        household_avg: null,
        outreach_pct: outreachAvg.toString(),
        soliciting_pct: solicitAvg.toString(),
        // This is where the object for OverflowMenu's is defined. This object is parsed by a ResourceIndexItem to generate the OverflowMenu. This is where the actions for the menu options should be attached.
        overflow: {
          overflow_items: [{ text: "Edit", action: () => history.push(`${ROUTES.ADMIN_ROUTES_EDIT}?route=${data.routeName}`) }, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
          { text: "Assign", action: () => assignRouteAction(data.routeName) },
          { text: "House Properties", action: () => onViewHouseProperties(data.routeName) },
          { text: "Unassign", action: () => overflow_actions.unassignRouteAction(data.routeName) },
          { text: "Revision History", action: overflow_actions.revisionHistoryAction },
          { text: "Delete", action: () => overflow_actions.deleteRouteAction(raw_routes[i].name) }
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

  // returns like [ {Rose Ln_R17 : streetData }, {Campbell Lane_R21: streetData} ]
  const fetchStreets = async (allStreets) => {
    var promises = allStreets.map(async (street) => {
      var streetDoc = await db.collection('Streets').doc(street).get();
      return streetDoc
    })
    var results = await Promise.all(promises.map(async (street) => {
      return street
    }))
    var buildStreets = [];
    results.forEach((streetPromise, i) => {
      var street = allStreets[i]
      buildStreets.push({ [street]: streetPromise.data() })
    });
    return buildStreets;
  }

  useEffect(() => {
    const unsubscribe = db.collection('Routes').onSnapshot(async snapshot => {
      const allRoutes = snapshot.docs.map((route) => {
        // TODO - fetch route visit date
        return ({
          ...(route.data()),
          routeName: route.id
        })
      });

      var allStreets = [];
      allRoutes.forEach((route) => {
        allStreets.push(route.streets);
      });
      var streetData = await fetchStreets([].concat.apply([], allStreets));

      setRoutes(tableTransform(allRoutes, streetData));
    });
    return function cleanup() {
      // Cleans up firebase listener when component unmounts
      unsubscribe()
    };
  }, []);

  let screen;


  if (routes) {
    screen = <div className="panel-screen">
      <RouteMetrics metrics={routeMetrics} />
      <br />
      <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
        {/* <SearchBar passedValue={queryState.queryString} queryCallback={searchRoutes} /> */}
        <Fab component={Link} to={ROUTES.ADMIN_ROUTES_NEW} color="primary" variant="extended">
          Create New Route
        </Fab>
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
      <ZeroResource name="routes" msg="Create routes to assign volunteers" />
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




  // ============================================================================
  //                        View House Properties                                
  // ============================================================================
  const onViewHouseProperties = (routeName) => {
    props.history.push({
      pathname: '/admin/view-house-props',
      state: routeName
    });
  }



  return (
    <>
      <TitleCard title="Routes"></TitleCard>

      <div className="container">
        {/* <PanelBanner title="Routes"/> */}
        <div style={{height: '50px'}}></div>
        <RouteColumnContext.Provider value={routeColumnNames}>
          <RouteItemsContext.Provider value={routes}>
            {screen}
          </RouteItemsContext.Provider>
        </RouteColumnContext.Provider>
        <ul>
          {/* <li><Link to={ROUTES.ASSIGN_ROUTE}>Assign Route</Link></li> */}
        </ul>
        <ul>
          {/* <li><Link to={ROUTES.ADMIN_ROUTES_EDIT}>Edit Route</Link></li> */}
        </ul>

        {/* assign route dialog */}
        <div>
          {/* <Button color="primary" onClick={handleClickOpen}>
            Assign Route
        </Button> */}
          <Dialog aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}
            open={open} onClose={handleClose}>
            <AssignRoute routes={route} close={handleClose} />
          </Dialog>
          {/* TODO: Show a success snackbar after assigning successfully */}
        </div>


        <div>

        </div>
      </div>
    </>
  );


};
export default RoutesPanel;
