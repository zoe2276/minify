// import logo from './logo.svg';
import * as React from "react"
import './App.css';
// import { Loading } from "./index"
import { LoginScreen, Player, SidebarMenu } from "./index"

function App() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [loggedIn, setLoggedIn] = React.useState(false);
  // const version = 0.1;
  
  if (window.localStorage.getItem('access_token') && !loggedIn) setLoggedIn(true);
  if (currentPage === 'login' && loggedIn) setCurrentPage('player');
  
  return (
    <>
      <SidebarMenu setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      {currentPage === 'login' && <LoginScreen setLoggedIn={setLoggedIn} />}
      {currentPage === 'player' && <Player /> }
      {/* {currentPage === 'settings' && <SettingsMenu />} */}
      <br />
    </>
  );
}

export default App;
