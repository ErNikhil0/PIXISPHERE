import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotographersProvider } from './Context/PhotographersContext';
import Home from './pages/Home';
import PhotographerProfile from './pages/PhotographerProfile';

function App() {
  return (
    <PhotographersProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photographers/:id" element={<PhotographerProfile />} />
        </Routes>
      </Router>
    </PhotographersProvider>
  );
}

export default App;