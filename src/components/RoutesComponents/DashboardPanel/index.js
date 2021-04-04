import React, { useEffect, useState } from "react";
import TitleCard from "../../ReusableComponents/TitleCard";
import ZeroResource from "../../ReusableComponents/ZeroResource";

import "./index.css";
import AbstractOne from "../../../assets/images/stat-abstract-1.png"
import AbstractTwo from "../../../assets/images/stat-abstract-2.png"
import AbstractThree from "../../../assets/images/stat-abstract-3.png"
import AbstractFour from "../../../assets/images/stat-abstract-4.png"
import DashboardNoResource from "../../../assets/images/dashboard-no-resource.png";
import db from "../../FirebaseComponents/Firebase/firebase";

const DashboardPanel = () => {
  let data = true;

  const [statsMap, setStatsMap] = useState(new Map());
  const [highestLearnMore, setHighestLearnMore] = useState("");
  const [highestAvgDonation, setHighestAvgDonation] = useState("");
  const [highestTotalDonations, setHighestTotalDonations] = useState("");

  useEffect(() => {
    db.collection('RoutesComplete').onSnapshot(async snapshot => {
      snapshot.docs.map((doc) => {

        let route = doc.data();

        let id = doc.id.split('_')[0];
        let stats = {
          perc_learn_more: 0,
          avg_donation: 0,
          total_donations: 0,
          total_learn_more: 0,
          efficiency: 0
        }

        for(let [key, houses] of Object.entries(route.streets)) {
          for(let i = 0; i < houses.length; i++) {
            let houseNumber = Object.keys(houses[i])[0];
            let houseProps = houses[i][houseNumber];

            if(houseProps.donationAmt != null) {
              stats.total_donations += houseProps.donationAmt;
            }
            if(houseProps.learnMore != null) {
              stats.total_learn_more += (houseProps.learnMore ? 1 : 0)
            }
          }
        }

        stats.perc_learn_more = stats.total_learn_more/route.housesTotal;
        stats.avg_donation = stats.total_donations/route.housesTotal;


        if(!statsMap.has(id)) {
          statsMap.set(id, stats);
        } else {
          let oldStats = statsMap.get(id);

          stats.total_donations += oldStats.total_donations;
          stats.total_learn_more += oldStats.total_learn_more;

          stats.perc_learn_more = stats.total_learn_more/route.housesTotal;
          stats.avg_donation = stats.total_donations/route.housesTotal;

          statsMap.set(id, stats);
        }
      });


      console.log(statsMap);

      // highest learn more
      let currHigh = 0;
      let currRouteHigh = ""
      for(let [route, value] of statsMap) {
        if(value.perc_learn_more > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestLearnMore(currRouteHigh);

      // highest Avg Donation
      currHigh = 0;
      currRouteHigh = ""
      for(let [route, stats] of statsMap) {
        if(stats.avg_donation > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestAvgDonation(currRouteHigh);


      // total donations
      currHigh = 0;
      currRouteHigh = ""
      for(let [route, stats] of statsMap) {
        if(stats.avg_donation > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestTotalDonations(currRouteHigh);
    });
  }, []);


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
                <h4 className="dashboard-metric-main">{highestLearnMore}</h4>
                <span className="dashboard-metric-label">
                  Route with Highest Percentage of Residents Interested in
                  Learning More
                </span>
              </div>
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-avgdonation">
                <img className="abstractThree" src={AbstractThree}></img>
                <h4 className="dashboard-metric-main">{highestAvgDonation}</h4>
                <span className="dashboard-metric-label">
                  Route with Greatest Average Donation per House
                </span>
              </div>
              <div className="dashboard-metric-item dashboard-metric-general dashboard-metric-totaldonation">
                <img className="abstractFour" src={AbstractFour}></img>
                <h4 className="dashboard-metric-main">{highestTotalDonations}</h4>
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
