import React, {useState, useContext, useEffect} from "react";
import { UserContext } from "../../provider/user";
import { SERVER_URL } from "../../constants/env";
import './index.css';
import { useSearchParams, Navigate } from "react-router-dom";
let mounted = true;


const TwitterLoading = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [redirect, setRedirect] = useState(false);
  const user = useContext(UserContext);
  useEffect(()=>{
      if(mounted)
        loginWithTwitter();

      mounted = false;
      return () => mounted = false;
  },[])

  const loginWithTwitter = async()=>{
    const codeVerifier = localStorage.getItem("codeVerifier");
    const result = await user.loginWithTwitter(searchParams.get("code"), searchParams.get("state"), codeVerifier);
    if(!result.status)
      alert(result.message)
    setRedirect(true);
  }
  return (
     <div
        className="App"
        style={{background: "rgba(0, 0, 0, 0.85)"}}>
          {
            redirect?
              <Navigate to="/" />
            :
            <div className="full-content content-center">
              Authorizing...
            </div>
          }
          

    </div>
  );
}

export default TwitterLoading;
