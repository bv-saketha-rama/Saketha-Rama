import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';

function App() {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Router>
        </DataProvider>
    );
}

export default App;

