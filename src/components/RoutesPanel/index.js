import React, {useState} from 'react';

import RouteMetrics from '../RouteMetrics';
import ZeroResource from '../ZeroResource';
import RoutesTable from '../RoutesTable';
import PanelBanner from '../PanelBanner';



const RoutesPanel = () => {
  const [routes, setRoutes] = useState(0);
  let screen;

  if(routes){
    screen = <div>
                <RouteMetrics/>
                <RoutesTable/>
             </div>;
  } else {
    screen = <div>
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
