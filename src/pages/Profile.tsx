import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import type { User } from '../lib/db';

export function Profile({
  user,
  onLogout,
  isAuthenticated
}: {
  user: User | null;
  onLogout: () => void;
  isAuthenticated: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
       setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
     if (!isAuthenticated) {
        navigate('/');
     }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-netflix-black text-white selection:bg-netflix-red selection:text-white pb-20">
      <Header scrolled={scrolled} isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      <main className="pt-32 px-4 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 border-b border-gray-800 pb-6 text-center md:text-left">
          Account Profile
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded bg-netflix-red flex items-center justify-center text-white font-bold text-5xl md:text-7xl shrink-0 shadow-lg shadow-black/50">
               {user.name ? user.name.slice(0, 2).toUpperCase() : 'YF'}
           </div>
           
           <div className="flex-1 w-full bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-xl">
             <div className="space-y-6">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Display Name</h3>
                  <p className="text-xl font-medium">{user.name || 'Set your display name'}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Email Address</h3>
                  <p className="text-xl font-medium">{user.email || 'No email provided'}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">User ID</h3>
                  <p className="text-sm font-mono text-gray-500 break-all">{user.id}</p>
                </div>
             </div>
             
             <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/my-list')}
                  className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
                >
                  View My List
                </button>
                <button 
                  onClick={onLogout}
                  className="px-6 py-3 border border-gray-600 rounded font-medium hover:border-white transition-colors w-full sm:w-auto"
                >
                  Sign Out of YouFlix
                </button>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
