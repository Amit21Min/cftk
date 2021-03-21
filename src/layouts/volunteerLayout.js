import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import ExampleMap from '../components/VolunteerComponents/VolunteerMap/example'


const AdminLayout = () => (
    <Switch>
        <Route exact path={ROUTES.VOLUNTEER_MAP}></Route>
        <Route exact path={ROUTES.VOLUNTEER_MESSAGES}></Route>
        <Route exact path={ROUTES.VOLUNTEER_PROGRESS}></Route>
        <Route exact path={ROUTES.VOLUNTEER_SETTINGS}></Route>
        {/* This is just a placeholder link for the mobile map example. Get rid of it when no one needs it anymore */}
        <Route exact path={'/volunteer/example'} component={ExampleMap}></Route>
    </Switch>


);

export default AdminLayout;