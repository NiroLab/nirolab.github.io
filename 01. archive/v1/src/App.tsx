import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import People from "@/pages/People";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Publications from "@/pages/Publications";
import News from "@/pages/News";
import NewsPost from "@/pages/NewsPost";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="people" element={<People />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="publications" element={<Publications />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsPost />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
