import React, { useState, useRef } from "react";
import PasswordRecoveryReq from "./recovery_request.jsx";
import ConfirmPasswordRecovery from "./confirm_recovery.jsx";

const PasswordRecovery = () => {
  const [ step, setStep ] = useState( 1 );
  const email = useRef( "amacri162013@yahoo.com" );
  if( step === 1 ) return <PasswordRecoveryReq email={ email } setStep={ setStep }/>;
  return <ConfirmPasswordRecovery email={ email } />;
};

export default PasswordRecovery;