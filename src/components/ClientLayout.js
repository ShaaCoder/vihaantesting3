import Navbar from './Navbar';
import Footer from './Footer'; // Make sure you create a Footer component

const ClientLayout = ({ children }) => {
  return (
    <div className=''>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
