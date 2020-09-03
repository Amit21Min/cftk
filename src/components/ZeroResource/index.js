import React from 'react';

import './index.css';

// Reusable component for displaying zero states for different resources. 

const ZeroResource = (props) => (
  <div>
    <h4 class="zero-resource-heading">No {props.name} are available</h4>
    <span class="zero-resource-message">{props.msg}</span>
  </div>
);

export default ZeroResource;
