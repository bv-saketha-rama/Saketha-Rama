import Header from '../components/Header';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Experience from '../components/Experience';
import OpenSource from '../components/OpenSource';
import Projects from '../components/Projects';
import Writing from '../components/Writing';
import Research from '../components/Research';
import Skills from '../components/Skills';
import Connect from '../components/Connect';
import Footer from '../components/Footer';

const HomePage = () => (
    <div className="min-h-screen bg-bg">
        <a href="#experience" className="skip-link">Skip to content</a>
        <Header />

        <main className="max-w-page mx-auto px-[var(--gutter)]">
            <About />
            <Testimonials />
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

export default HomePage;
