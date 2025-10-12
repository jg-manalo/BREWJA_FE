import React from 'react'

export default function Header() {
  return (
    <header className="bg-purple-900 py-4 shadow-md">
      {/* Moved horizontal padding (px-6) here */}
      <span className="text-white text-2xl font-bold tracking-wide px-6">
        BrewHa
      </span>
    </header>
  )
}