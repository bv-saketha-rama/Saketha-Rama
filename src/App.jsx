import { DataProvider } from './context/DataContext';
import HomePage from './pages/HomePage';

function App() {
    return (
        <DataProvider>
            <HomePage />
        </DataProvider>
    );
}

export default App;

