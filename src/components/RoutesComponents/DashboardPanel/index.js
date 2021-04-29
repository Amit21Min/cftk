import React, { useEffect, useState } from "react";
import TitleCard from "../../ReusableComponents/TitleCard";
import ZeroResource from "../../ReusableComponents/ZeroResource";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core";

import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

import "./index.css";
import AbstractOne from "../../../assets/images/stat-abstract-1.png";
import AbstractTwo from "../../../assets/images/stat-abstract-2.png";
import AbstractThree from "../../../assets/images/stat-abstract-3.png";
import AbstractFour from "../../../assets/images/stat-abstract-4.png";
import GoldBadge from "../../../assets/images/Gold Badge.png";
import SilverBadge from "../../../assets/images/Silver Badge.png";
import BronzeBadge from "../../../assets/images/Bronze Badge.png";
import DashboardNoResource from "../../../assets/images/dashboard-no-resource.png";
import db from "../../FirebaseComponents/Firebase/firebase";
import { auth } from "firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  dashboardPaper: {
    backgroundColor: "white",
    borderRadius: "24px",
    height: "168px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  chartPaper: {
    marginBottom: "70px",
    borderRadius: "24px",
  },
}));

const DashboardPanel = () => {
  const classes = useStyles();
  const history = useHistory();

  let data = true;

  const [statsMap, setStatsMap] = useState(new Map());
  const [highestLearnMore, setHighestLearnMore] = useState("");
  const [highestAvgDonation, setHighestAvgDonation] = useState("");
  const [highestTotalDonations, setHighestTotalDonations] = useState("");

  const [groupStatMap, setGroupStatMap] = useState(new Map());
  const [sortedGroupMap, setSortedGroupMap] = useState(new Map());

  const [chartData, setChartData] = useState([]);
  const styles = {
    titleText: {
      textAlign: "left",
      fontWeight: 600,
      fontSize: "20px",
      lineHeight: "23px",
    },
  };
  const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <Title.Text {...restProps} className={classes.titleText} />
  ));

  useEffect(() => {
    db.collection("RoutesComplete").onSnapshot(async (snapshot) => {
      snapshot.docs.map((doc) => {
        let route = doc.data();

        // CALCULATIONS FOR STATS FOR ROUTES
        let id = doc.id.split("_")[0];
        let stats = {
          perc_learn_more: 0,
          avg_donation: 0,
          total_donations: 0,
          total_learn_more: 0,
          efficiency: 0,
        };

        for (let [key, houses] of Object.entries(route.streets)) {
          for (let i = 0; i < houses.length; i++) {
            let houseNumber = Object.keys(houses[i])[0];
            let houseProps = houses[i][houseNumber];

            if (houseProps.donationAmt != null) {
              stats.total_donations += Number(houseProps.donationAmt);
            }

            if (houseProps.learnMore != null) {
              stats.total_learn_more += houseProps.learnMore ? 1 : 0;
            }
          }
        }

        // STATS FOR GROUP LEADERBOARD
        let group_name = route.assignedTo;

        if (group_name != null) {
          if (!groupStatMap.has(group_name)) {
            groupStatMap.set(group_name, stats.total_donations);
          } else {
            let old_total = groupStatMap.get(group_name);
            groupStatMap.set(group_name, stats.total_donations + old_total);
          }
        }

        // END OF GROUP LEADERBOARD STATS

        stats.perc_learn_more = stats.total_learn_more / route.housesTotal;
        stats.avg_donation = stats.total_donations / route.housesTotal;

        if (!statsMap.has(id)) {
          statsMap.set(id, stats);
        } else {
          let oldStats = statsMap.get(id);

          stats.total_donations += oldStats.total_donations;
          stats.total_learn_more += oldStats.total_learn_more;

          stats.perc_learn_more = stats.total_learn_more / route.housesTotal;
          stats.avg_donation = stats.total_donations / route.housesTotal;

          statsMap.set(id, stats);
        }
      });

      // setting chart data
      let arr = [];
      for (let [key, value] of statsMap.entries()) {
        let data_ = {
          route: key,
          total_amount: value.total_donations,
        };
        arr.push(data_);
      }
      arr.sort((a, b) => b.total_amount - a.total_amount);
      setChartData(arr);

      // highest learn more
      let currHigh = 0;
      let currRouteHigh = "";
      for (let [route, value] of statsMap) {
        if (value.perc_learn_more > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestLearnMore(currRouteHigh);

      // highest Avg Donation
      currHigh = 0;
      currRouteHigh = "";
      for (let [route, stats] of statsMap) {
        if (stats.avg_donation > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestAvgDonation(currRouteHigh);

      // total donations
      currHigh = 0;
      currRouteHigh = "";
      for (let [route, stats] of statsMap) {
        if (stats.avg_donation > currHigh) {
          currRouteHigh = route;
        }
      }
      setHighestTotalDonations(currRouteHigh);

      // top 3 for group donations
      let new_group_map = new Map(
        [...groupStatMap].sort((a, b) => b[1] - a[1])
      );
      setSortedGroupMap(new_group_map);
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
            <div className="graph-container">
              <Paper className={classes.chartPaper} variant="outlined">
                <Chart data={chartData}>
                  <ArgumentAxis />
                  <ValueAxis max={7} />
                  <BarSeries
                    valueField="total_amount"
                    argumentField="route"
                    color="#0075A3"
                    barWidth={0.5}
                  />
                  <Title
                    text="Routes By Donation Total"
                    textComponent={TextComponent}
                  />
                  <Animation />
                </Chart>
              </Paper>
              <div className="group-stat-container">
                <Paper variant="outlined" className={classes.dashboardPaper}>
                  <span className="donationTitle">Donation Leaderboard</span>
                  <div className="donation-wrapper">
                    {Array.from([...sortedGroupMap.keys()])
                      .slice(0, 3)
                      .map((key, i) => {
                        let place = "3rd Place";
                        let img_src = BronzeBadge;
                        if (i + 1 === 1) {
                          place = "1st Place";
                          img_src = GoldBadge;
                        }
                        if (i + 1 === 2) {
                          place = "2nd Place";
                          img_src = SilverBadge;
                        }
                        return (
                          <div
                            className="group-leaderboard-wrapper"
                            key={`${place}`}
                          >
                            <img
                              src={img_src}
                              className="group-stat-badge"
                              key={`img_src ${img_src}`}
                            ></img>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span key={key} className="group-stat-primary">
                                {key}
                              </span>
                              <span key={i} className="group-stat-secondary">
                                {place} | ${sortedGroupMap.get(key)}{" "}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Paper>
              </div>
            </div>
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
                <h4 className="dashboard-metric-main">
                  {highestTotalDonations}
                </h4>
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
