import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Community Brew Profiles",
      description: "Explore magical brews shared by the community.",
      path: "/community-brews",
      emoji: "🔮", // Crystal ball
    },
    {
      title: "My Brew Profiles",
      description: "Manage your own mystical brew creations.",
      path: "/my-brews",
      emoji: "✨", // Sparkles
    },
    {
      title: "Create Brew Profile",
      description: "Conjure a new brew profile from scratch.",
      path: "/create-brew",
      emoji: "🧹", // Wizard
    },
    {
      title: "Start Brewing",
      description: "Begin a brewing session with your selected spell.",
      path: "/start-brewing",
      emoji: "🍵", // Tea (elixir)
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-yellow-300 mb-8 shadow-md">
          Sorcery Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-11/12 max-w-6xl">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              className="cursor-pointer bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transform transition duration-200"
            >
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                {card.emoji} {card.title}
              </h2>
              <p className="text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
