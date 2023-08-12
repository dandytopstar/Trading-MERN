import React, {useState, useContext, useEffect} from "react";
import {Navigate} from "react-router-dom";
import { UserContext } from "../../provider/user";
import { OrderContext } from "../../provider/order";
import Header from "../../components/header";
import { SERVER_URL } from "../../constants/env";
import './index.css';


const Profile = (props) => {
  const [fileSource, setFileSource] = useState();
  const [file, setFile] = useState();
  const [name, setName] = useState();
  const user = useContext(UserContext);
  const order = useContext(OrderContext);
  const onSubmit = ()=>{
    user.updateUser(name, fileSource);
    console.log("filesource", fileSource);
    
  }
  const handlechange = (event)=>{
    if(event.target.files.length>0){
      const file = URL.createObjectURL(event.target.files[0]);
      setFile(file);
      setFileSource(event.target.files[0]);
    }
  }

  useEffect(()=>{
    if(user.userInfo.islogin)
      setName(user.userInfo.userName);
  },[user.userInfo])
  
  return (
    <div>
    {
          !user.userInfo.islogin?
          <Navigate to="/" />
          :
          <div className="App"
              style={{background: "rgba(0, 0, 0, 0.85)"}}>
                <div className="full-content">
                  <Header />
                  <div style={{height: "20px"}}></div>
                  {
                      user.userInfo.islogin &&

                      <div className="flex-center">
                          <div>
                            <img  src={`${SERVER_URL}/useravatar/${user.userInfo.userAvatar}`} style={{width: "128px", marginLeft: "16px", borderRadius : '70px'}}/>
                            <input 
                              type="file" 
                              id="file" 
                              placeholder="Profile Picture" 
                              name="myfiles" 
                              accept="image/png, image/jpeg" 
                              onChange={handlechange} />
                          </div>
                      
                          <div>userName: <input type="text" value={name} onChange={e=>setName(e.target.value)} /></div>
                          <button onClick={onSubmit} type="submit">Submit</button>
                        </div>
                    }
                  <div style={{height: "20px"}}></div>

                    {
                      user.userInfo.islogin &&
                      <div className="flex-center">

                        <div>ETH: <input type="text" value={user.userInfo.eth.toFixed(12)} readOnly={true}/></div>
                        <div>ETH(holding): <input type="text" value={user.userInfo.eth_holding.toFixed(12)} readOnly={true}/></div>

                        <div>USD: <input type="text" value={user.userInfo.usd.toFixed(2)} readOnly={true}/></div>
                        <div>USD(holding): <input type="text" value={user.userInfo.usd_holding.toFixed(2)} readOnly={true}/></div>

                        <button onClick={async() => {
                          let result = await user.reset();
                          console.log("sfsf", result);
                          if(result)
                            order.getMyOrders();
                          
                        }}>Reset</button>
                      </div>
                    }
                    
                </div>

          </div>
        }
    </div>
    
     
  );
}

export default Profile;
