import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../style/teamDashboard.css';

function TeamDashboardPage() {
  const [teamData, setTeamData] = useState(null);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Not logged in, redirect to login page
        navigate('/login');
        return;
      }

      try {
        // Load team data
        const teamDoc = await getDoc(doc(db, 'teams', user.uid));
        if (teamDoc.exists()) {
          const data = teamDoc.data();
          setTeamData(data);
          setSelectedComponents(data.components || []);
        }

        // Load all products from database
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableComponents(productsList);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage('Error loading team data. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleComponentToggle = (component) => {
    setSelectedComponents(prevSelected => {
      // Check if component is already selected
      const isAlreadySelected = prevSelected.some(item => item.id === component.id);
      
      if (isAlreadySelected) {
        // Remove from selection
        return prevSelected.filter(item => item.id !== component.id);
      } else {
        // Add to selection
        return [...prevSelected, component];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Ensure each component has the correct structure needed for matching
      const componentsToSave = selectedComponents.map(component => {
        // Make sure vendorName is included
        if (!component.vendorName && component.vendorId) {
          // If a vendor is found with this ID in availableComponents
          const vendor = availableComponents.find(c => c.vendorId === component.vendorId);
          if (vendor) {
            return {
              ...component,
              vendorName: vendor.vendorName
            };
          }
        }
        return component;
      });
      
      // Save selected components to team profile
      await updateDoc(doc(db, 'teams', auth.currentUser.uid), {
        components: componentsToSave
      });
      
      setMessage('Your available components have been updated!');
    } catch (error) {
      console.error('Error saving components:', error);
      setMessage('Error saving components. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="loading">Loading team dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ paddingTop: '100px' }}>
      <div className="dashboard-header">
        <div className="team-info">
          <h1>Team Dashboard: {teamData?.teamName}</h1>
          <p>{teamData?.email}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="component-selection">
          <div className="selection-header">
            <h2>Select Components You Have Available</h2>
            <p>Share your spare parts with other FTC teams</p>
          </div>
          
          {message && <div className="message">{message}</div>}
          
          <div className="components-grid">
            {availableComponents.map(component => (
              <div 
                key={component.id} 
                className={`component-card ${selectedComponents.some(item => item.id === component.id) ? 'selected' : ''}`}
                onClick={() => handleComponentToggle(component)}
              >
                <div className="component-image">
                  <img src={component.imgSrc} alt={component.name} />
                </div>
                <div className="component-details">
                  <h3>{component.name}</h3>
                  <p>{component.vendorName}</p>
                </div>
                <div className="selection-indicator">
                  {selectedComponents.some(item => item.id === component.id) ? '✓' : '+'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="save-section">
            <p>Selected {selectedComponents.length} components</p>
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDashboardPage;