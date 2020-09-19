import React from 'react';

import "./index.css";

const MetricItem = (props) => (
  <div className="metric-item">
    <h4 className="metric-item-metric">{props.metric}</h4>
    <span className="metric-item-label">{props.label}</span>
  </div>
);

export default MetricItem;
