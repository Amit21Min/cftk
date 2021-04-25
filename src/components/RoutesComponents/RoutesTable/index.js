import React from 'react';
import {DataGrid} from '@material-ui/data-grid';

const columns = [
  {field: 'name', headerName: 'Name'},
  {field: 'assignment_status', headerName: 'Assignment Status'},
  {field: 'months_since_assigned', headerName: 'Months Since Last Assigned'},
  {field: 'amount_collected', headerName: 'Previous Canning Donations'},
  {field: 'household_avg', headerName: 'Average Donation per Household'},
  {field: 'outreach_pct', headerName: 'Percentage Interested in Carolina for the Kids'},
  {field: 'soliciting_pct', headerName: 'Allows Soliciting'}
]

const RoutesTable = () => {
  return (
    <div>
      <DataGrid rows={props.rows} columns={columns}/>
    </div>
  )
}
