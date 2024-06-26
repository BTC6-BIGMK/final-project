import { TutorialPage } from "./pages/TutorialPage";
import { SpotsMapPage } from "./pages/SpotsMapPage";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  navigator.serviceWorker
    .register(`/service-worker.js`, {
      scope: "../",
    })
    .then((reg) => console.log("サービスワーカーの登録成功", reg.scope))
    .catch((err) => console.log("サービスワーカーの登録失敗", err));

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
