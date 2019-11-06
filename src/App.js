import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import EmpRouter from './container/EmpRouter';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <EmpRouter />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

