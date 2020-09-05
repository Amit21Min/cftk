import React, {useState} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import RoutesTable from '../RoutesTable';
import PanelBanner from '../PanelBanner';



const RoutesPanel = () => {
  const [routes, setRoutes] = useState({test: 1});
  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });

  const route_data_fields = ["Street", "Months Since Last Assigned", "Assignment Status", "Donations From Last Canning", "Average Donation Per House", "Percentage Wants to Learn More", "Percentage Allows Soliciting"];
  const routes_data = [{settings: [], data: ["Wohler Court", "6", "Not Assigned", "$300", "$100", "31%", "25%"]},{settings: [], data: ["Easy Street", "6", "Not Assigned", "$1000", "$100", "29%", "22%"]},];

  let screen;

  if(routes){
    screen = <div class="panel-screen">
                <RouteMetrics metrics={routeMetrics}/>
                <br/>
                <RoutesTable data={routes_data} fields={route_data_fields}/>
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
