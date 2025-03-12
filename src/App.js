import logo from './logo.svg';
import './App.css';
import WorldClockApp from './WorldClockApp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <WorldClockApp></WorldClockApp>
      </header>
    </div>
  );
}

export default App;
