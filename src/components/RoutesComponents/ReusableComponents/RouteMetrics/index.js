import React from 'react';

import MetricItem from '../MetricItem';

import "./index.css";

const RouteMetrics = (props) => {
  return (
    <div className="metric-list-container">
      <div className='route-metric-assign route-metric-general'>
        <MetricItem metric={props.metrics.total_assigned} label="routes assigned" />
      </div>

      <div className='route-metric-ready route-metric-general'>
        <MetricItem metric={props.metrics.ready_to_be_assigned} label="routes ready to be assigned" />
      </div>
      <div className='route-metric-donations route-metric-general'>
        <MetricItem metric={props.metrics.donations_last_event} label="latest event donation amount" />
      </div>
      <div className='route-metric-gain route-metric-general'>
        <MetricItem metric={props.metrics.donations_from_year} label="one-year total donation amount" />
      </div>
    </div>
  );
};

export default RouteMetrics;
