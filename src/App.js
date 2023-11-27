// import logo from './logo.svg';
import * as React from "react"
import './App.css';
// import { Loading } from "./index"
import { LoginScreen, Player, Refresh } from "./index"

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const version = 0.1;
  if (window.localStorage.getItem('access_token') && !loggedIn) setLoggedIn(true);
  return (
    <>
      {/* <Button text="Test" action={() => {console.debug("clicked")}} /> */}
      {/* <Loading /> */}
      {/* {loggedIn ? console.log('app.js received logged in param as true') : console.log(`loggedIn: ${loggedIn}`)} */}
      {!loggedIn ? <LoginScreen setLoggedIn={setLoggedIn} /> :
        <>
          <div>Welcome to <b>minify</b> <i>v{version}</i></div>
          <br />
          <Player />
        </>
      }
      <br />
      <Refresh setLoggedIn={setLoggedIn} />
    </>
  );
  
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
