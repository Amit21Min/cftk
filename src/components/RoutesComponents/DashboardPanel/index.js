import React from 'react';
import TitleCard from '../../ReusableComponents/TitleCard';
import ZeroResource from '../../ReusableComponents/ZeroResource';
import PanelBanner from '../ReusableComponents/PanelBanner';

import './index.css'
import DashboardNoResource from '../../../assets/images/dashboard-no-resource.png';

const DashboardPanel = () => (
  <div>
    <TitleCard title="Dashboard"></TitleCard>
    <div className="dashboard-container">
        <img src={DashboardNoResource}></img>
        <br></br>
        <ZeroResource name="data" msg="Collect data for multiple routes to view a data dashboard."></ZeroResource>
    </div>
  </div>
);

export default DashboardPanel;
