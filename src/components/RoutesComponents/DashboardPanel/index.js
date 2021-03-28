import React, { useState } from 'react';
import TitleCard from '../../ReusableComponents/TitleCard';
import ZeroResource from '../../ReusableComponents/ZeroResource';
import PanelBanner from '../ReusableComponents/PanelBanner';

import './index.css'
import DashboardNoResource from '../../../assets/images/dashboard-no-resource.png';
import RouteMetrics from '../ReusableComponents/RouteMetrics';

const DashboardPanel = () => {

  let data = true;

  const [routeMetrics, setRouteMetrics] = useState({
    total_assigned: "0",
    ready_to_be_assigned: "1",
    donations_this_year: "$300",
    delta_from_last_canning: "N/A"
  });

  return (
  <div>
    <TitleCard title="Dashboard"></TitleCard>
    <div className="dashboard-container">
      {!data && 
        <div>
          <img src={DashboardNoResource}></img>
          <br></br>
          <ZeroResource name="data" msg="Collect data for multiple routes to view a data dashboard."></ZeroResource>
        </div>
      }
      {data && 
        <RouteMetrics metrics={routeMetrics}/>
      }

    </div>
  </div>
  );
};

export default DashboardPanel;
