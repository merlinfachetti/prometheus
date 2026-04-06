import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Welcome } from "./pages/Welcome";
import { ModuleOverview } from "./pages/ModuleOverview";
import { Lesson } from "./pages/Lesson";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/module/:moduleId" element={<ModuleOverview />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
