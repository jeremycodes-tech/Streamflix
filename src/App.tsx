import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { MyList } from './pages/MyList';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { BrowseCategory } from './pages/BrowseCategory';
import type { Movie } from './lib/data';
import { AnimatePresence } from 'framer-motion';
import { AuthModal } from './components/AuthModal';
import { VideoPlayer } from './components/VideoPlayer';
import { db } from './lib/db';
import { auth } from './lib/firebase';
import type { User } from './lib/db';
import './App.css';

function App() {
  const [authUser, setAuthUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('streamflix_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [myList, setMyList] = useState<Movie[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const location = useLocation();
  const isAuthenticated = !!authUser;

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('streamflix_auth_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('streamflix_auth_user');
    }
  }, [authUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        // Safe to fetch because the Firebase SDK is fully initialized and authenticated now
        const dbList = await db.getUserMyList(firebaseUser.uid);
        
        setMyList(prev => {
          const combined = [...dbList];
          let changed = false;
          
          prev.forEach(guestMovie => {
            if (!combined.find(m => m.id === guestMovie.id)) {
              combined.push(guestMovie);
              changed = true;
            }
          });
          
          if (changed) {
            db.saveUserMyList(firebaseUser.uid, combined);
          }
          return combined;
        });
      }
      // On logout or no user, do nothing to myList here.
      // handleLogout will clear it explicitly.
    });

    return () => unsubscribe();
  }, []);

  const toggleMyList = (movie: Movie) => {
    const isRemoving = myList.find(m => m.id === movie.id);
    const newList = isRemoving 
      ? myList.filter(m => m.id !== movie.id) 
      : [...myList, movie];
      
    setMyList(newList);
    
    if (authUser) {
      db.saveUserMyList(authUser.id, newList);
    }
  };

  const handlePlayClick = (movie?: Movie) => {
    if (isAuthenticated) {
      if (movie) {
        setPlayingMovie(movie);
      } else {
        // If no movie passed (e.g. from Hero with no explicit movie), try to use featured
        // But App.tsx doesn't have easy access to Home's featured movie yet.
        // We'll update the components to pass the movie.
        console.warn("No movie provided to play");
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    const user = await db.loginUser(email, pass);
    setAuthUser(user);
    setShowAuthModal(false);
  };

  const handleSignUp = async (email: string, pass: string) => {
    const user = await db.createUser(email, pass);
    setAuthUser(user);
    setShowAuthModal(false);
  };

  const handleGoogleLogin = async () => {
    const user = await db.googleLogin();
    setAuthUser(user);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await db.logoutUser();
    setAuthUser(null);
    setMyList([]);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <Home 
                myList={myList} 
                toggleMyList={toggleMyList} 
                onPlayClick={handlePlayClick} 
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/detail/:type/:id" 
            element={
              <MovieDetail 
                myList={myList} 
                toggleMyList={toggleMyList} 
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/my-list" 
            element={
              <MyList 
                myList={myList} 
                toggleMyList={toggleMyList} 
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/search" 
            element={
              <Search 
                myList={myList} 
                toggleMyList={toggleMyList} 
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <Profile 
                user={authUser}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            } 
          />
          <Route 
            path="/tv-shows" 
            element={
              <BrowseCategory
                pageTitle="TV Shows"
                type="tv"
                myList={myList}
                toggleMyList={toggleMyList}
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/movies" 
            element={
              <BrowseCategory
                pageTitle="Movies"
                type="movie"
                myList={myList}
                toggleMyList={toggleMyList}
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
          <Route 
            path="/latest" 
            element={
              <BrowseCategory
                pageTitle="New & Popular"
                type="popular"
                myList={myList}
                toggleMyList={toggleMyList}
                onPlayClick={handlePlayClick}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
              />
            } 
          />
        </Routes>
      </AnimatePresence>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onGoogleLogin={handleGoogleLogin}
      />
      <VideoPlayer 
        movie={playingMovie} 
        onClose={() => setPlayingMovie(null)} 
      />
    </>
  );
}

export default App;
