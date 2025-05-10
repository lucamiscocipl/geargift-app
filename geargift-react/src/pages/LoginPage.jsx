import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import '../style/login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Create new user with email/password
        console.log("Attempting to create user with email:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created successfully:", user.uid);
        
        // Store additional team data in Firestore
        console.log("Storing team data for:", teamName);
        try {
          await setDoc(doc(db, 'teams', user.uid), {
            teamName: teamName,
            email: email,
            createdAt: new Date(),
            components: [] // Initialize empty components list
          });
          console.log("Team data stored successfully");
        } catch (dbError) {
          console.error("Database error:", dbError);
          setError(`Database error: ${dbError.message}`);
          setLoading(false);
          return;
        }
        
        // Navigate to dashboard
        navigate('/team-dashboard');
      } else {
        // Sign in existing user
        console.log("Attempting to sign in with email:", email);
        await signInWithEmailAndPassword(auth, email, password);
        
        // Check if team data exists
        const teamDoc = await getDoc(doc(db, 'teams', auth.currentUser.uid));
        if (!teamDoc.exists()) {
          setError('Team account not found. Please sign up first.');
          setLoading(false);
          return;
        }
        
        // Navigate to dashboard
        navigate('/team-dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error.code, error.message);
      
      // Handle specific error messages
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="container">
      <div className="logo-sm"><img src="/media/qrobotics-logo.png" alt="QRobotics Logo"/></div>
      <div className="container-mini login-container">
        <div className="left-side">
          <img src="/media/geargift-white.png" alt="Geargift Logo" />
        </div>
        <div className="right-side">
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <h1>{isSignUp ? 'Register Your FTC Team' : 'Team Login'}</h1>
              
              <input
                type="email"
                placeholder="Team Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Team Name (e.g., Quantum Robotics)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              )}
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              
              {error && <p className="error-message">{error}</p>}
              
              <button type="submit" className="send-button" disabled={loading}>
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
              
              <p className="toggle-form">
                {isSignUp ? 'Already have an account?' : 'Need an account?'} 
                <span onClick={toggleMode}>{isSignUp ? ' Sign In' : ' Sign Up'}</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;