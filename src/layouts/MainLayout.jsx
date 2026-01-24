import MainNav from '../components/nav';
import Footer from '../components/Footer';
import AppToaster  from '../components/AppToaster';
export default function MainLayout({ children }) {
  return (
    <>
        <MainNav/>
        <AppToaster />
        <div className='min-h-screen w-full'>{children}</div>
        <Footer/>
    </>
    
  );
}
