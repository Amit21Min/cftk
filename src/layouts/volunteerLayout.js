import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import ExampleMap from '../components/VolunteerComponents/VolunteerMap/example'
import VolunteerSettings from '../components/VolunteerComponents/VolunteerSettings';
import VolunteerProgress from '../components/VolunteerComponents/VolunteerProgress/index.js';
import VolunteerMessages from '../components/VolunteerComponents/VolunteerMessages/index.js';

const VolunteerLayout = () => (
    <Switch>
        <Route exact path={ROUTES.VOLUNTEER_MAP} component={ExampleMap}></Route>
        <Route exact path={ROUTES.VOLUNTEER_MESSAGES} component={VolunteerMessages}></Route>
        <Route exact path={ROUTES.VOLUNTEER_PROGRESS} component={VolunteerProgress}></Route>
        <Route exact path={ROUTES.VOLUNTEER_SETTINGS} component={VolunteerSettings}></Route>
        {/* This is just a placeholder link for the mobile map example. Get rid of it when no one needs it anymore */}
        <Route exact path={'/volunteer/example'} component={ExampleMap}></Route>
    </Switch>


);

export default VolunteerLayout;