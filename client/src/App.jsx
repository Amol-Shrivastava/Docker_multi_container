import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';


function App() {
 
  return (
    <Router>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <header> 
        <Link to='/'>Home</Link> |  <Link to='/other'>OtherPage</Link>
      </header>
      <div>
        <Routes>
          <Route exact path='/' element={<Fib />} />
          <Route path='/other' element={<OtherPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
