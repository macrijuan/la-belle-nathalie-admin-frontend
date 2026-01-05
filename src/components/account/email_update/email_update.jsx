import React, { useState, useRef } from "react";
import ConfirmCurrentEmailOwnerShip from "./confirm_current_email_ownership.jsx";
import ConfirmNewEmailOwnerShip from "./confirm_new_email_ownership.jsx";
import "./email_update.css";

const EmailUpdate = ({ setAccountOrUpd, user }) => {
  const [ emailToCheck, setEmailToCheck ] = useState("current");
  const possibleNewEmail = useRef( user.possible_new_email || 0 );
  return(
    <div className="EmailUpdate-Wrap">
      <div className="EmailUpdate-Header-Components">
        <button style={{ float:"left" }} onClick={ () => { setAccountOrUpd( "account" ); } }>atrás</button>
        <h1 className="EmailUpdate-header">Actualización de correo electrónico</h1>
      </div>
      {
        ( ( user.possible_new_email && Date.now() < user.email_update_expiration ) || emailToCheck === "new" )
          ?<ConfirmNewEmailOwnerShip user={ user } setAccountOrUpd={ setAccountOrUpd } possibleNewEmail={ possibleNewEmail.current } />
        :<ConfirmCurrentEmailOwnerShip user = { user } setAccountOrUpd={ setAccountOrUpd } setEmailToCheck={ setEmailToCheck } possibleNewEmail={ possibleNewEmail } />
      }
    </div>
  );
};

export default EmailUpdate