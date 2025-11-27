import MainNav from '../components/nav';
import Footer from '../components/Footer';
export default function MainLayout({ children }) {
  return (
    <>
        <MainNav/>
        <div className='min-h-screen w-full'>{children}</div>
        <Footer/>
    </>
    
  );
}
