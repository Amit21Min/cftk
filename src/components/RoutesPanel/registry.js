import React from 'react';
import ComponentRegistry from "../ComponentRegistry";
import ResourceIndexTable from '../ResourceIndexTable';

const registry = new ComponentRegistry({
  components: {
    "resourceIndexTable": ResourceIndexTable,
  }
});

export default registry;
