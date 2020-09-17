import React from 'react';

import PanelBanner from '../PanelBanner';
import OverflowMenu from '../OverflowMenu';

const VolunteersPanel = () => {

  const buttonOneCallback = () => {
    console.log("Button 1");
  }

  const buttonTwoCallback = () => {
    console.log("Button 2");
  }

  const overflow_menu_items = [{text: "Button 1", action: buttonOneCallback}, {text: "Button 2", action: buttonTwoCallback}];

  return(
  <div>
    <PanelBanner title="Volunteers"/>

    <OverflowMenu items={overflow_menu_items}/>
  </div>);
};

export default VolunteersPanel;
