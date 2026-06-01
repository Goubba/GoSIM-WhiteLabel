import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Search } from './views/Search';
import { PackagesList } from './views/PackagesList';
import { Status } from './views/Status';

const AppContent: React.FC = () => {
  return (
    <div id="root" className="min-h-screen flex flex-col bg-white">
      {/* Dynamic Desktop Header Navbar */}
      <Header />

      {/* Main Content Viewport */}
      <main className="max-w-6xl w-full mx-auto p-4 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/packages/:code" element={<PackagesList />} />
          <Route path="/status/:id" element={<Status />} />
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </main>

      {/* Dynamic Desktop Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
