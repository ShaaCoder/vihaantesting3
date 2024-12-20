import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Accreditations from '../components/Accreditations';
import Footer from '../components/Footer';
import ClientLayout from '@/components/ClientLayout';

const HomePage = () => (
  <ClientLayout>
    <HeroSection />
    <About />
    <Testimonials />
    <Contact />
    <Accreditations />
  </ClientLayout>
);

export default HomePage;
