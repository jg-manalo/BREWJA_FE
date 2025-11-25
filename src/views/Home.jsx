import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
export default function Home() {

// w-full bg-hero bg-black/70 bg-blend-overlay bg-cover bg-center
  
  return (
    <MainLayout>        
      <main className="flex min-h-screen">
        <div className="w-full justify-center bg-center gap-8 grid items-center">
            <div className="rounded-xl flex flex-col p-8justify-center items-center text-white">
                <h1 className="text-5xl flex pb-8 justify-center emphasis-text bg-gradient-to-b from-yellow-200 to-amber-900 bg-clip-text text-transparent" >
                Share Your Legendary Elixirs
                </h1>
                <h2 className='body-text text-2xl mb-8'>
                Join the Brewja Guild to chronicle your tea journeys, discover ancient community recipes, and master the perfect steep.
                </h2>
                <div className="flex flex-col items-center body-text text-xl">
                    <Link to="/register" className="bg-amber-800 hover:bg-amber-700 hover:text-yellow-400 hover:scale-110 transition-all p-4 rounded-2xl mb-4">JOIN THE COMMUNITY</Link>
                    <Link to="/community-brews" className="border-2 border-orange-400 bg-transparent backdrop-blur-2xl hover:text-yellow-400 hover:scale-110 transition-all p-4 rounded-2xl mb-4">BROWSE COMMUNITY BREWS</Link>
                </div>
            </div>
            <div>
            </div>
        </div>
      </main>
    </MainLayout>
  );
}
