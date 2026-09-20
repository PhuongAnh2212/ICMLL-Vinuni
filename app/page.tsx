import Background from "@/components/Background";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Motion from "@/components/Motion";
import PixelCursor from "@/components/PixelCursor";
import Research from "@/components/Research";
import People from "@/components/People";
import Loader from "@/components/Loader";
import { About, News, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <div className="page">
      <Loader />
      <Background />
      <PixelCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        <People />
        <News />
      </main>
      <Footer />
      <Motion />
    </div>
  );
}
