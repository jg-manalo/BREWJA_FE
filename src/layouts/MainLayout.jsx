import MainNav from '../components/nav';
import Footer from '../components/Footer';
export default function MainLayout({ children }) {
  return (
    <>
        <MainNav/>
        <div>{children}</div>
        <Footer/>
    </>
    
  );
}
