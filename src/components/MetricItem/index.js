import React from 'react';

import "./index.css";

const MetricItem = (props) => (
  <div class="metric-item">
    <h4 class="metric-item-metric">{props.metric}</h4>
    <span class="metric-item-label">{props.label}</span>
  </div>
);

export default MetricItem;
