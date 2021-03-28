import React, { useState } from "react";
import TitleCard from "../../ReusableComponents/TitleCard";
import ZeroResource from "../../ReusableComponents/ZeroResource";
import PanelBanner from "../ReusableComponents/PanelBanner";

import "./index.css";
import AbstractOne from "../../../assets/images/stat-abstract-1.png"
import AbstractTwo from "../../../assets/images/stat-abstract-2.png"
import AbstractThree from "../../../assets/images/stat-abstract-3.png"
import AbstractFour from "../../../assets/images/stat-abstract-4.png"
import DashboardNoResource from "../../../assets/images/dashboard-no-resource.png";

const DashboardPanel = () => {
  let data = true;

  return (
    <div>
      <TitleCard title="Dashboard"></TitleCard>
      <div>
        {!data && (
          <div className="dashboard-container">
            <img src={DashboardNoResource}></img>
            <br></br>
            <ZeroResource
              name="data"
              msg="Collect data for multiple routes to view a data dashboard."
            ></ZeroResource>
          </div>
        )}
        {data && (
          <div className="data-container">
            <div className="graph-container">Hello</div>
            <div className="stat-container">
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-efficient">
                <img className="abstractOne" src={AbstractOne}></img>
                <h4 className="dashboard-metric-main">H23</h4>
                <span className="dashboard-metric-label">
                  Most Efficient Route
                </span>
              </div>
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-learnmore">
                <img className="abstractTwo" src={AbstractTwo}></img>
                <h4 className="dashboard-metric-main">M14</h4>
                <span className="dashboard-metric-label">
                  Route with Highest Percentage of Residents Interested in
                  Learning More
                </span>
              </div>
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-avgdonation">
                <img className="abstractThree" src={AbstractThree}></img>
                <h4 className="dashboard-metric-main">T19</h4>
                <span className="dashboard-metric-label">
                  Route with Greatest Average Donation per House
                </span>
              </div>
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-totaldonation">
                <img className="abstractFour" src={AbstractFour}></img>
                <h4 className="dashboard-metric-main">B28</h4>
                <span className="dashboard-metric-label">
                  Route with Greatest Total Donations
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;
