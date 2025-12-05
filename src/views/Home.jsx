import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
export default function Home() {
  
  return (
    <>
      <div className="landing-page-bg">
        <MainLayout>        
          <main className="flex flex-col justify-center min-h-screen">
            <div className="w-full justify-center bg-center gap-8 grid items-center">
                <div className="rounded-xl flex flex-col sm:p-2 p-8 justify-center items-center text-white">
                    <h1 className="text-center text-6xl flex pb-8 justify-center emphasis-text bg-gradient-to-b from-yellow-200 to-amber-900 bg-clip-text text-transparent" >
                    Share Your Legendary Elixirs
                    </h1>
                    <h2 className='font-serif font-light text-xl mb-8 text-justify'>
                    Join the Brewja Guild to chronicle your tea journeys, discover ancient community recipes, and master the perfect steep.
                    </h2>
                    <div className="flex gap-x-4 body-text text-xl">
                        <Link to="/register" className="text-center bg-amber-800 hover:bg-amber-700 hover:text-yellow-400 hover:scale-110 transition-all p-4 rounded-xl mb-4">JOIN THE GUILD</Link>
                        <Link to="/community-brews" className="text-center border-2 border-orange-400 bg-transparent backdrop-blur-2xl hover:text-yellow-400 hover:scale-110 transition-all p-4 rounded-2xl mb-4">CHECK BREWS</Link>
                    </div>
                </div>
                <div>
                </div>
            </div>
          </main>
        </MainLayout>
      </div>
    </>
  );
}
