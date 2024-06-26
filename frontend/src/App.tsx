import { TutorialPage } from "./pages/TutorialPage";
import { SpotsMapPage } from "./pages/SpotsMapPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="h-full bg-[url('/washi.jpeg')] z-50	">
        <Routes>
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/spots-map" element={<SpotsMapPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
