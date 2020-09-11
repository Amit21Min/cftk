import React, {useState} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import SearchBar from '../SearchBar';
import AddButton from '../AddButton';
import ResourceIndexTable from '../ResourceIndexTable';
import PanelBanner from '../PanelBanner';

import * as ROUTES from '../../constants/routes';

const RoutesPanel = () => {
  const [routes, setRoutes] = useState([
    {settings: [], data: { id: 1, returned: ["Wohler Court", "6", "Not Assigned", "$300", "$100", "31%", "25%"]}},
    {settings: [], data: { id: 2, returned: ["Easy Street", "6", "Not Assigned", "$1000", "$100", "29%", "22%"]}}
  ]);
  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });
  const [queryState, setQueryState] = useState({sort: false, queryString: ""});
  const [selectedResources, setSelectedResources] = useState({
    1: false,
    2: true
  });

  const route_data_fields = ["", "Street", "Months Since Last Assigned", "Assignment Status", "Donations From Last Canning", "Average Donation Per House", "Percentage Wants to Learn More", "Percentage Allows Soliciting"];


  const searchRoutes = (query_string) => {
    let new_query = Object.assign({}, queryState, {queryString: query_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  // Uses the string of a column title to alter the routes query
  const sortRoutes = (column_string) => {
    let new_query = Object.assign({}, queryState, {sort: column_string});
    setQueryState(new_query);
    console.log(queryState);
  }

  const handleRouteSelect = (route) => {
    console.log(route)
    let new_selected_resources = Object.assign({}, selectedResources);
    new_selected_resources[route] = true;
    setSelectedResources(new_selected_resources);
    console.log(selectedResources);
  }

  const deselectRoute = (route) => {

  }

  const newRoute = () => {
    console.log("Creating a new route!");
  }

  let screen;

  if(routes){
    screen = <div class="panel-screen">
                <RouteMetrics metrics={routeMetrics}/>
                <br/>
                <div style={{width: "100%", display: "flex", 'flex-direction': "row", 'justify-content': "space-between"}}>
                  <SearchBar queryCallback={searchRoutes}/>
                  <AddButton clickCallback={newRoute} route={ROUTES.ADMIN_ROUTES_NEW}/>
                </div>
                <ResourceIndexTable
                    items={routes}
                    columns={route_data_fields}
                    selectItemCallback={selectRoute}
                    selectColumnCallback={sortRoutes}
                />
             </div>;
  } else {
    screen = <div class="panel-screen">
                <ZeroResource name="routes" msg="Create routes to assign volunteers"/>
             </div>;
  }

  return(
    <div>
      <PanelBanner title="Routes"/>
      {screen}
    </div>
  );
};

export default RoutesPanel;
