// import logo from './logo.svg';
import * as React from "react"
import './App.css';
// import { Loading } from "./index"
import { LoginScreen } from "./index"

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)
  return (
    <>
      {/* <Button text="Test" action={() => {console.debug("clicked")}} /> */}
      {/* <Loading /> */}
      {!loggedIn && <LoginScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
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
