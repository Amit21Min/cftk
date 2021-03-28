import React from 'react';

import './index.css';

// Reusable component for displaying zero states for different resources. 

const ZeroResource = (props) => (
  <div>
    <h4 className="zero-resource-heading">No {props.name} is available</h4>
    <span className="zero-resource-message">{props.msg}</span>
  </div>
);

export default ZeroResource;
