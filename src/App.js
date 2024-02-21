import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Chatbot from './Chatbot';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Chatbot />} />
        </Routes>
    </Router>
  );
}

export default App;
