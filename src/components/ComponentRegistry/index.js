// Just a simple helper class for Compnent Transporter

class ComponentRegistry {
  constructor(registry = {}) {
    this._registry = registry;
  }

  getComponent = id => {
    return this._registry.components[id] ? this._registry.components[id] : null;
  }
}

export default ComponentRegistry;

// street_contents = { registry: registry,
//                     componentType: "resourceIndexTable",
//                     componentProps: {
//                       selectableItemHandler: table.selectStreet,
//                       selectableColumnHandler: (event) => {table.selectAllStreets(event, ["Easy St", "Hard Knocks Alley"])},
//                       items: [
//                         {route: "R17", name: "Easy St", amount_collected: "$1M", assignment_status: "", months_since_assigned: "", outreach_pct: "98%", soliciting_pct: "99%", overflow: {overflow_items: [{text: "Edit", action: () => overflow_actions.editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
//                                                     {text: "Assign", action: overflow_actions.assignRouteAction},
//                                                     {text: "House Properties", action: overflow_actions.housePropertiesAction},
//                                                     {text: "Revision History", action: overflow_actions.revisionHistoryAction},
//                                                     {text: "Delete", action: () => overflow_actions.deleteRouteAction(raw_routes[i].name)}
//                                                   ]}},
//                         {route: "R17", name: "Hard Knocks Alley", amount_collected: "$3.50", assignment_status: "", months_since_assigned: "", outreach_pct: "2%", soliciting_pct: "1%", overflow: {overflow_items: [{text: "Edit", action: () => overflow_actions.editRouteAction(raw_routes[i].name)}, // notice how we have to bind arguments to the actions here, where the fully compiled function will be passed to the generated OverflowMenu component
//                                                     {text: "Assign", action: overflow_actions.assignRouteAction},
//                                                     {text: "House Properties", action: overflow_actions.housePropertiesAction},
//                                                     {text: "Revision History", action: overflow_actions.revisionHistoryAction},
//                                                     {text: "Delete", action: () => overflow_actions.deleteRouteAction(raw_routes[i].name)}
//                                                   ]}}
//                       ],
//                       columns: streetColumnNames
//                     }
//                   }
