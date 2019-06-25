import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Default from './Default';
import Map from './Map';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Default} />
      <Route path="/map" component={Map} />
    </Router>
  );
}

export default App;
