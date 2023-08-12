import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserProvider from "./provider/user";
import OrderProvider from "./provider/order";
import LeaderboardProvider from './provider/leaderboard';
import Home from "./pages/home";
import LeaderBoard from './pages/leaderboard';
import Profile from './pages/profile';
import DiscordLoading from './pages/discordLoading';
import TwitterLoading from './pages/twitterLoading';
import './App.css';

function App() {

 
  return (
    <UserProvider>
      <OrderProvider>
        <LeaderboardProvider>
          <BrowserRouter >
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/discord-auth' element={<DiscordLoading />} />
              <Route path='/twitter-auth' element={<TwitterLoading />} />
              <Route path='/leaderboard' element={<LeaderBoard />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </LeaderboardProvider>
      </OrderProvider>
    </UserProvider>
  );
}

export default App;
