import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import '../style/cart.css';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState(''); // '', 'processing', 'matching', 'success'
  const [matchingTeams, setMatchingTeams] = useState({});
  const [requestingTeam, setRequestingTeam] = useState(null);
  
  const db = getFirestore();

  // Get the currently logged in team
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const auth = await import('firebase/auth').then(module => module.getAuth());
        if (auth.currentUser) {
          const { doc, getDoc } = await import('firebase/firestore');
          const teamDoc = await getDoc(doc(db, 'teams', auth.currentUser.uid));
          if (teamDoc.exists()) {
            setRequestingTeam(teamDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    
    fetchTeamData();
  }, [db]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Find teams with matching components
  const findMatchingTeams = async () => {
    setCheckoutStatus('processing');
    
    try {
      const teamsCollection = collection(db, 'teams');
      const matchResults = {};
      
      // For each cart item, find teams that have it in their components list
      for (const item of cartItems) {
        const teamsWithItem = [];
        
        // Query teams collection for teams with this component
        const teamsQuery = query(teamsCollection);
        const teamSnapshot = await getDocs(teamsQuery);
        
        teamSnapshot.forEach(teamDoc => {
          const teamData = teamDoc.data();
          
          // Skip the requesting team
          if (requestingTeam && teamData.email === requestingTeam.email) {
            return;
          }
          
          // Check if team has this component in their available components
          const hasComponent = teamData.components && 
                              teamData.components.some(comp => 
                                comp.name === item.name && 
                                comp.vendorName.toLowerCase() === item.vendorName.toLowerCase()
                              );
          
          if (hasComponent) {
            teamsWithItem.push({
              id: teamDoc.id,
              teamName: teamData.teamName,
              email: teamData.email
            });
          }
        });
        
        if (teamsWithItem.length > 0) {
          matchResults[item.id] = {
            item: item,
            teams: teamsWithItem
          };
        }
      }
      
      setMatchingTeams(matchResults);
      
      // If we found any matches, go to matching screen
      if (Object.keys(matchResults).length > 0) {
        setCheckoutStatus('matching');
      } else {
        // No matching teams found, proceed to success
        simulateEmails({});
        setCheckoutStatus('success');
      }
    } catch (error) {
      console.error("Error finding matching teams:", error);
      alert("There was an error processing your request. Please try again.");
      setCheckoutStatus('');
    }
  };

  // Save request details to the database
  const saveRequestToDatabase = async (matches) => {
    try {
      if (!requestingTeam) return;
      
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      // Create a record of the request
      await addDoc(collection(db, 'requests'), {
        requestingTeam: {
          id: requestingTeam.id,
          name: requestingTeam.teamName,
          email: requestingTeam.email
        },
        requestedItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          vendorName: item.vendorName,
          quantity: item.quantity
        })),
        matchingTeams: Object.values(matches).flatMap(match => 
          match.teams.map(team => ({
            teamId: team.id,
            teamName: team.teamName,
            email: team.email,
            componentId: match.item.id,
            componentName: match.item.name
          }))
        ),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error("Error saving request to database:", error);
    }
  };

  // Handle the final checkout after team matching
  const handleFinalCheckout = () => {
    simulateEmails(matchingTeams);
    saveRequestToDatabase(matchingTeams);
    setCheckoutStatus('success');
    clearCart();
  };

  // Simulate sending emails (just console log for now)
  const simulateEmails = (matches) => {
    if (!requestingTeam) {
      console.warn("Cannot send notifications: Requesting team information is missing");
      return;
    }
    
    console.log("===== EMAIL NOTIFICATIONS =====");
    
    // For each matched part
    Object.values(matches).forEach(match => {
      const { item, teams } = match;
      
      // For each team that has this part
      teams.forEach(team => {
        console.log(`TO: ${team.email}`);
        console.log(`SUBJECT: Component Request from ${requestingTeam.teamName}`);
        console.log(`BODY: 
Hello ${team.teamName},

${requestingTeam.teamName} (${requestingTeam.email}) is looking for a component that you might have:

Component: ${item.name}
Vendor: ${item.vendorName}
Quantity requested: ${item.quantity}

If you can provide this component, please contact them directly at ${requestingTeam.email}.

Thanks for being part of our FTC community!

Regards,
GearGift Team
        `);
        console.log("--------------------------------");
      });
    });
    
    console.log("================================");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="cart-wrapper">
          <div className="loading-cart">Loading your cart...</div>
        </div>
      </div>
    );
  }

  // Team matching screen
  if (checkoutStatus === 'matching') {
    return (
      <div className="page-container">
        <div className="cart-wrapper">
          <h1>Team Matching Results</h1>
          <div className="matching-results">
            <p className="match-intro">
              <strong>Good news!</strong> We found teams that might have the components you're looking for. 
              If you proceed, we'll notify these teams about your request.
            </p>
            
            {Object.values(matchingTeams).map(match => (
              <div key={match.item.id} className="match-item">
                <div className="match-component">
                  <img src={match.item.imgSrc} alt={match.item.name} />
                  <div className="match-component-info">
                    <h3>{match.item.name}</h3>
                    <p>{match.item.vendorName}</p>
                    <p>Quantity requested: {match.item.quantity}</p>
                  </div>
                </div>
                
                <div className="match-teams">
                  <h4>Teams with this component:</h4>
                  <ul>
                    {match.teams.map(team => (
                      <li key={team.id}>{team.teamName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            
            <div className="cart-summary matching-summary">
              <p>
                By continuing, we'll notify these teams about your request and provide them with your team's contact information.
              </p>
              <button 
                className="checkout-button"
                onClick={handleFinalCheckout}
              >
                Confirm and Complete Request
              </button>
              
              <button 
                className="clear-cart-button"
                onClick={() => setCheckoutStatus('')}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (checkoutStatus === 'success') {
    return (
      <div className="page-container">
        <div className="cart-wrapper">
          <div className="success-message">
            <h2>Request Submitted Successfully!</h2>
            <p>Teams with matching components have been notified of your request.</p>
            <p>You'll receive direct communication from teams who can provide the requested components.</p>
            <Link to="/" className="continue-button">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // Regular cart view
  return (
    <div className="page-container">
      <div className="cart-wrapper">
        <h1>Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="continue-button">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.imgSrc} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-vendor">{item.vendorName}</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="total">
                <span>Total Items</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              
              <button 
                className="checkout-button"
                onClick={findMatchingTeams}
                disabled={checkoutStatus === 'processing' || !requestingTeam}
              >
                {checkoutStatus === 'processing' ? 'Finding Teams...' : 'Request Items'}
              </button>
              
              {!requestingTeam && (
                <div className="login-warning">
                  Please <Link to="/login">log in</Link> to submit your request
                </div>
              )}
              
              <button 
                className="clear-cart-button"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;