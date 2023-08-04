import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/login/login";
import Home from "./routes/home/home";

const App = () => {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Fragment>
  );
};

export default App;
