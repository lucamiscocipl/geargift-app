import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch additional team data
        try {
          const teamDoc = await getDoc(doc(db, 'teams', user.uid));
          if (teamDoc.exists()) {
            setTeamData(teamDoc.data());
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      } else {
        setTeamData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    teamData,
    loading,
    signOut,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};