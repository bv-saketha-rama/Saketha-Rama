import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import OpenSource from '../components/OpenSource';
import Projects from '../components/Projects';
import Writing from '../components/Writing';
import Research from '../components/Research';
import Skills from '../components/Skills';
import Connect from '../components/Connect';
import Footer from '../components/Footer';

const HomePage = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
            <Header toggleTheme={toggleTheme} isDark={isDark} />

            <main className="max-w-3xl mx-auto px-6 py-12">
                <Hero />
                <About />
                <Experience />
                <OpenSource />
                <Projects />
                <Writing />
                <Research />
                <Skills />
                <Connect />
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
