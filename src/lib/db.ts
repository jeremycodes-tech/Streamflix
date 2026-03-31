import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { auth, googleProvider, firestore } from './firebase';
import type { Movie } from './data';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
}

export const db = {
  createUser: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || email.split('@')[0],
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('User already exists. Please Sign In.');
      }
      throw new Error(error.message);
    }
  },

  loginUser: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || email.split('@')[0],
      };
    } catch (error: any) {
      throw new Error('Invalid email or password.');
    }
  },

  googleLogin: async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || 'Google User',
      };
    } catch (error: any) {
      throw new Error('Google Login failed or was cancelled.');
    }
  },

  getUserMyList: async (userId: string): Promise<Movie[]> => {
    try {
      const docRef = doc(firestore, 'user_lists', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().movies || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching list:', error);
      return [];
    }
  },

  logoutUser: async (): Promise<void> => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  saveUserMyList: async (userId: string, movies: Movie[]): Promise<void> => {
    try {
      const docRef = doc(firestore, 'user_lists', userId);
      await setDoc(docRef, { movies }, { merge: true });
    } catch (error) {
      console.error('Error saving list:', error);
    }
  }
};
