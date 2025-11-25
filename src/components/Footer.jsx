import { Link } from 'react-router-dom';


export default function Nav() {

  return (
    <footer className="bg-black/20 backdrop-blur-md p-4 flex justify-end w-full items-center sticky top-0 z-50 border-b border-white/10">
      <div className=''>
        <Link to="/" className='text-2xl text-white font-bold logo-header'>
          Brewja
        </Link>
      </div>
    </footer>
  );
}
