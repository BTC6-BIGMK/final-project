import { TutorialPage } from "./pages/TutorialPage";
import { SpotsMapPage } from "./pages/SpotsMapPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/spots-map" element={<SpotsMapPage />} />
      </Routes>
    </>
  );
}

export default App;
