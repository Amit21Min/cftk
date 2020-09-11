import React, {useState} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import RoutesTable from '../RoutesTable';
import PanelBanner from '../PanelBanner';

import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const RoutesPanel = () => {
  const [routes, setRoutes] = useState({test: 1});
  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });


  let screen;

  if(routes){
    screen = <div class="panel-screen">
                <RouteMetrics metrics={routeMetrics}/>
                <br/>
                <RoutesTable/>
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
      <ul>
        <li><Link to={ROUTES.EDIT_ROUTE}>Edit Route</Link></li>
      </ul>
    </div>
  );
};

export default RoutesPanel;
