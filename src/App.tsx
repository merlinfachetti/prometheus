import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Welcome } from "./pages/Welcome";
import { ModuleOverview } from "./pages/ModuleOverview";
import { ModuleComplete } from "./pages/ModuleComplete";
import { Lesson } from "./pages/Lesson";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/module/:moduleId" element={<ModuleOverview />} />
          <Route path="/module/:moduleId/complete" element={<ModuleComplete />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
