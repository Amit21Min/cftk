import React from 'react';

import * as overflow_actions from './overflow_actions.js';

export const init_street_columns = [
  // {field: "selectbox",             type: "selectbox",        html_text: "", selected_items: []},
  {field: "name",                  type: "text",             html_text: "Name"},
  {field: "assignment_status",     type: "text",             html_text: "Assignment Status"},
  {field: "months_since_assigned", type: "text",             html_text: "Months Since Last Assigned"},
  {field: "amount_collected",      type: "text",             html_text: "Previous Canning Donations"},
  {field: "outreach_pct",          type: "text",             html_text: "Wants to Learn More"},
  {field: "soliciting_pct",        type: "text",             html_text: "Allows Soliciting"},
  // {field: "overflow",              type: "overflow-menu",    overflow_items: [
  //                                                             {text: "Assign All", action: () => {overflow_actions.assignAllAction()}}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
  //                                                             {text: "Delete All", action: () => {overflow_actions.deleteAllAction()}}
  //                                                           ]}

];
export const init_route_columns = [
  {field: "selectbox",             type: "selectbox",        html_text: "", selected_items: []},
  {field: "drop_down",             type: "drop-down-parent", html_text: ""},
  {field: "name",                  type: "text",             html_text: "Name"},
  {field: "assignment_status",     type: "text",             html_text: "Assignment Status"},
  {field: "months_since_assigned", type: "text",             html_text: "Months Since Last Assigned"},
  {field: "amount_collected",      type: "text",             html_text: "Previous Canning Donations"},
  {field: "outreach_pct",          type: "text",             html_text: "Wants to Learn More"},
  {field: "soliciting_pct",        type: "text",             html_text: "Allows Soliciting"},
  {field: "overflow",              type: "overflow-menu",    overflow_items: [
                                                              {text: "Assign All", action: () => {overflow_actions.assignAllAction()}}, // because this field has type "overflow-menu" it requires an overflow_items list, which will be provided to an OverflowMenu component
                                                              {text: "Delete All", action: () => {overflow_actions.deleteAllAction()}}
                                                             ]
  }
];

export const StreetItemsContext  = React.createContext([]);

export const StreetColumnContext = React.createContext(init_street_columns);

export const RouteItemsContext  = React.createContext([]);
export const RouteColumnContext = React.createContext(init_route_columns);
