import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Community Brew Profiles",
      description: "Explore magical brews shared by the community.",
      path: "/community-brews",
    },
    {
      title: "My Brew Profiles",
      description: "Manage your own mystical brew creations.",
      path: "/my-brews",
    },
    {
      title: "Create Brew Profile",
      description: "Conjure a new brew profile from scratch.",
      path: "/create-brew",
    },
    {
      title: "Start Brewing",
      description: "Begin a brewing session with your selected spell.",
      path: "/start-brewing",
    },
  ];

  return (
    <div className="dashboard-bg min-h-screen">
      <MainLayout>
        <div className="flex flex-col items-center py-10 font-serif">
          <div className="mb-8 rounded-2xl border border-amber-300/25 bg-black/35 px-8 py-3 backdrop-blur-sm shadow-[0_8px_35px_rgba(0,0,0,0.45)]">
            <h1 className="emphasis-text text-4xl lg:text-6xl font-bold text-amber-300 drop-shadow-[0_4px_14px_rgba(0,0,0,0.75)] text-center">
              Sorcery Dashboard
            </h1>
            <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-11/12 max-w-6xl">
            {cards.map((card, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(card.path)}
                className="relative overflow-hidden cursor-pointer rounded-2xl border border-amber-200/20 bg-slate-900/65 p-6 text-left backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:shadow-[0_10px_40px_rgba(251,191,36,0.2)]"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
                <h2 className="mb-2 flex items-center text-2xl font-semibold text-amber-100">
                  {card.emoji} {card.title}
                </h2>
                <p className="text-slate-200/90">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
