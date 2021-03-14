import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import VolunteerMap from '../components/VolunteerComponents/VolunteerMap/test'


const AdminLayout = () => (
    <Switch>
        <Route exact path={ROUTES.VOLUNTEER_MAP} component={VolunteerMap}></Route>
        <Route exact path={ROUTES.VOLUNTEER_MESSAGES}></Route>
        <Route exact path={ROUTES.VOLUNTEER_PROGRESS}></Route>
        <Route exact path={ROUTES.VOLUNTEER_SETTINGS}></Route>
    </Switch>


);

export default AdminLayout;