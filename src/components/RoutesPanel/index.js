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

const RoutesPanel = () => {
  const [routes, setRoutes] = useState(null);

  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });
  const [queryState, setQueryState] = useState({sort: false, queryString: ""});
  const [selectedResources, setSelectedResources] = useState({});

// Provides its keys to resourceIndexItem(s) to be used as accessors to correctly match data to html table columns. The string per key is the text which is displayed as the html table column headers
  const [routeColumnNames, setRouteColumnNames] = useState({selectbox: "",
                    name: "Name",
                    assignment_status: "Assignment Status",
                    months_since_assigned: "Months Since Last Assigned",
                    amount_collected: "Previous Canning Donations",
                    household_avg: "Average Donation per Household",
                    outreach_pct: "Wants to Learn More",
                    soliciting_pct: "Allows Soliciting"
                  });


  const searchRoutes = (query_string) => {
    let new_query = Object.assign({}, queryState, {queryString: query_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  const selectRoute = (route_key, option) => {
    let new_selected_resources = Object.assign({}, selectedResources);
    new_selected_resources[route_key] = option;
    setSelectedResources(new_selected_resources);
  }

  const selectAllRoutes = (option) => {
    let new_selected_resources = Object.assign({}, selectedResources)
    Object.keys(new_selected_resources).forEach(r => new_selected_resources[r] = option);
    setSelectedResources(new_selected_resources);
    console.log(selectedResources);
  }

  // handles click events on ResourceIndexTableHeaders
  const selectColumnHandler = (column_message) => {
      switch(column_message.type){
        case "select-all":
          selectAllRoutes(column_message.option);
          break;
        default:
          sortRoutes(column_message.query_string);
      }
  }

  // Uses the string of a column title to alter the routes query
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, {sort: column_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  const handleRouteSelect = (route_key) => {
    let new_selected_resources = Object.assign({}, selectedResources);
    new_selected_resources[route_key] = true;
    setSelectedResources(new_selected_resources);
  }

  // Takes routes returned from database, and performs necessary calculations and applies transformations/validations required by ResourceIndexTable.
  //  In general, provides info for keys of routeColumnNames
  const tableTransform = (routes) => {
    let tabled_routes = [];
    for(let i = 0; i < routes.length; i++){
      let months_since_assigned;
      let total_donations;
      // for now, we need this to validate each route
      if(routes[i].name){
        if(routes[i].canningData){
          if(routes[i].canningData.lastCanned){
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
            name: routes[i].name,
            assignment_status: routes[i].assignmentStatus ? routes[i].assignmentStatus.toString() : "",
            months_since_assigned: months_since_assigned.toString(),
            amount_collected: total_donations,
            household_avg: null,
            outreach_pct: null,
            soliciting_pct: null
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
    db.collection('Routes').onSnapshot(snapshot => {
      const allRoutes = snapshot.docs.map((route) => ({
        ...route.data()
      }));
      setRoutes(allRoutes);
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
                    items={tableTransform(routes)}
                    columns={routeColumnNames}
                    selectedItems={selectedResources}
                    selectItemCallback={selectRoute}
                    selectColumnCallback={selectColumnHandler}
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
        <li><Link to={ROUTES.EDIT_ROUTE}>Edit Route</Link></li>
      </ul>
    </div>
  );
};

export default RoutesPanel;
