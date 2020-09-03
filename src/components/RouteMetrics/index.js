import React from 'react';

import MetricItem from '../MetricItem';

import "./index.css";

const RouteMetrics = (props) => {
  return (
    <div class="metric-list-container">
      <MetricItem metric={props.metrics.total_assigned}       label="Total Assigned"/>
      <MetricItem metric={props.metrics.ready_to_be_assigned} label="Ready to be Assigned"/>
      <MetricItem metric={props.metrics.donations_this_year}  label="Total Donations This Year"/>
      <MetricItem metric={props.metrics.delta_from_last_canning} label="Gain/Loss From Last Canning Date"/>
    </div>
  );
};

export default RouteMetrics;
