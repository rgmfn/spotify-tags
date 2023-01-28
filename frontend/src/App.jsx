import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './components/Home';
// import Login from './components/Login';
import NotFound from './components/NotFound';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            // when go to / (like website.com/), it renders the Home component
            path="/" exact element={
              <Home />
            }
          />
          {/* <Route path="/login" exact element={<Login />} /> */}
          <Route
            // when path is anything but above specified, shows NotFound
            path="*"
            element={
              <NotFound />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
