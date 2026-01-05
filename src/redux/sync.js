import { actioner, actions } from "../redux/action_names.js";

export const resetState = () => actioner( actions.SYNC, actioner( actions.SESSION ) );
//Data in page
export const setFilter = ( type, filterName, initialValue ) => actioner( actions.FILTER, actioner( type, { filterName, initialValue } ) );
export const setFilterValues = ( prop, filters ) => actioner( actions.FILTER, actioner( actions.UPDATE, { prop, filters } ) );
//Sync
export const setProp = ( prop, data ) => actioner( actions.SYNC, actioner( actions.SET_PROP, { prop, data } ) );
export const setProp2 = ( data ) => actioner( actions.SYNC, actioner( actions.SET_PROP2, data ) );
export const setEmailUpdateExpiration = ( data ) => actioner( actions.SYNC, actioner( actions.USER_EMAIL_UPDATE, data ) );

//session
export const signOut = () => actioner( actions.SYNC, actioner( actions.SESSION ) );