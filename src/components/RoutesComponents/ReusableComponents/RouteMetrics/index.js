import React from 'react';

import MetricItem from '../MetricItem';
import AbstractOne from "../../../../assets/images/stat-abstract-1.png";
import AbstractTwo from "../../../../assets/images/stat-abstract-2.png";
import AbstractThree from "../../../../assets/images/stat-abstract-3.png";
import AbstractFour from "../../../../assets/images/stat-abstract-4.png";

import "./index.css";

const RouteMetrics = (props) => {
  return (
    <div className="metric-list-container">
      <div className='route-metric-assign route-metric-general'>
        <img src={AbstractOne} alt="" className="route-metric-abstract"></img>
        <MetricItem metric={props.metrics.total_assigned} label="routes assigned" />
      </div>

      <div className='route-metric-ready route-metric-general'>
        <img src={AbstractTwo} alt="" className="route-metric-abstract"></img>
        <MetricItem metric={props.metrics.ready_to_be_assigned} label="routes ready to be assigned" />
      </div>
      <div className='route-metric-donations route-metric-general'>
        <img src={AbstractThree} alt="" className="route-metric-abstract"></img>
        <MetricItem metric={props.metrics.donations_last_event} label="latest event donation amount" />
      </div>
      <div className='route-metric-gain route-metric-general'>
        <img src={AbstractFour} alt="" className="route-metric-abstract"></img>
        <MetricItem metric={props.metrics.donations_from_year} label="one-year total donation amount" />
      </div>
    </div>
  );
};

export default RouteMetrics;
