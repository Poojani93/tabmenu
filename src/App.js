import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Daily from "./Components/Daily";
import SectionCard from "./Components/SectionCard";
import Menu from "./Components/Menu";

const App = () => {
  return (
    <div>
      <Menu />

      <div>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Daily id={"powerReading0"} />}
            ></Route>
            <Route
              path="/section1"
              element={<Daily id={"powerReading1"} />}
            ></Route>
            <Route
              path="/section2"
              element={<Daily id={"powerReading2"} />}
            ></Route>
            <Route
              path="/section3"
              element={<Daily id={"powerReading3"} />}
            ></Route>
            <Route
              path="/section3/web4"
              element={<Daily id={"power"} />}
            ></Route>
            <Route
              path="/section4"
              element={<Daily id={"powerReading4"} />}
            ></Route>
            <Route
              path="/section5"
              element={<Daily id={"powerReading5"} />}
            ></Route>
            <Route
              path="/section6"
              element={<Daily id={"powerReading6"} />}
            ></Route>
            <Route
              path="/section7"
              element={<Daily id={"powerReading7"} />}
            ></Route>
            <Route
              path="/section8"
              element={<Daily id={"powerReading8"} />}
            ></Route>
            <Route
              path="/section9"
              element={<Daily id={"powerReading9"} />}
            ></Route>
            <Route
              path="/section10"
              element={<Daily id={"powerReading10"} />}
            ></Route>
            <Route
              path="/section11"
              element={<Daily id={"powerReading11"} />}
            ></Route>
            <Route
              path="/section12"
              element={<Daily id={"powerReading12"} />}
            ></Route>
            <Route
              path="/section13"
              element={<Daily id={"powerReading13"} />}
            ></Route>
            <Route
              path="/section14"
              element={<Daily id={"powerReading14"} />}
            ></Route>
            <Route
              path="/section15"
              element={<Daily id={"powerReading15"} />}
            ></Route>
            <Route
              path="/section16"
              element={<Daily id={"powerReading16"} />}
            ></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
