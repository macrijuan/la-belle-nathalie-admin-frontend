import { actioner, actions, errs, config } from "./action_names.js";
import store from "./store.js";

export const requestEmailUpdateToken = async dispatch => {
  const res = await fetch( `${process.env.SERVER}/user/email/put_user_email`, config( store.getState().user.token, "PUT" ) );
  return dispatch(
    actioner(
      actions.PUT,
      actioner(
        actions.USER_EMAIL_UPDATE, !res.ok ?await res.json().catch( () => errs.conn ) :null
      )
    )
  );
};