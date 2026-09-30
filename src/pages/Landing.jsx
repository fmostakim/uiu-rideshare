import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
