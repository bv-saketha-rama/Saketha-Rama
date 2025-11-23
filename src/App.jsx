import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import RacingBackground from './components/RacingBackground'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import CustomCursor from './components/CustomCursor'
import StartLights from './components/StartLights'

const AppContent = () => {
    const [showStartLights, setShowStartLights] = useState(true);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-racing-asphalt text-racing-cyan selection:bg-racing-cyan selection:text-racing-asphalt font-racing">
            <CustomCursor />

            {/* Start Lights Animation */}
            {showStartLights && (
                <StartLights onComplete={() => setShowStartLights(false)} />
            )}

            {/* Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <RacingBackground />
            </div>

            <main className="relative z-10 flex flex-col items-center px-4 py-20 md:px-10">
                <Hero />
                <Projects />
                <Skills />
            </main>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    )
}

export default App

