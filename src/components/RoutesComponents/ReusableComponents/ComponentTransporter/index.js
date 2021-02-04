import React from 'react';

// serves as a hub for various components, and is used to transport components as serializable data objects between other components.
const ComponentTransporter = ({componentType, registry, componentProps}) => {
  // Expects a prop of componentType(key), and componentProps(object)
  const Component = registry.getComponent(componentType);
  return <Component {...componentProps}/>;
};

export default ComponentTransporter;
