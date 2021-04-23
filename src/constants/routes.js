export const LANDING = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const FORGOT_PASSWORD = '/forgot-password';

// Admin ROUTES
export const ADMIN_DASHBOARD  = ADMIN+'/dashboard';
export const ADMIN_ROUTES     = ADMIN+'/routes';
export const ADMIN_ROUTES_NEW = ADMIN_ROUTES+'/new';
export const ADMIN_VOLUNTEERS = ADMIN+'/volunteers';
export const VIEW_HOUSE_PROPS = ADMIN + '/view-house-props';

// Edit route
export const ADMIN_ROUTES_EDIT = ADMIN_ROUTES+'/edit';
// Assign route
export const ASSIGN_ROUTE = ADMIN_ROUTES+'/assign';
// Delete route
export const ADMIN_ROUTES_DEL = ADMIN+'/delete'

// Volunteer UI
export const VOLUNTEER = '/volunteer';
// create new volunteer group
export const ADMIN_VOLUNTEER_NEW_GROUP=ADMIN+'/volunteers/newgroup';

export const VOLUNTEER_ASSIGNMENT = VOLUNTEER + '/assignment';
export const VOLUNTEER_SETTINGS = VOLUNTEER + '/settings';
export const VOLUNTEER_MAP = VOLUNTEER + '/map';
export const VOLUNTEER_PROGRESS = VOLUNTEER + '/progress';
export const VOLUNTEER_MESSAGES = VOLUNTEER + '/messages';
