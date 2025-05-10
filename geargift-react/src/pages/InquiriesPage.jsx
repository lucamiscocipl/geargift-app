// filepath: geargift-react/src/pages/InquiriesPage.jsx
import { useState } from 'react';

function InquiriesPage() {
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamMessage, setTeamMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Basic validation (can be expanded)
    if (!teamName || !teamEmail || !teamMessage) {
      alert('Please fill in all fields.');
      return;
    }
    // Handle the form submission logic (e.g., send data to a server)
    console.log({
      name: teamName,
      email: teamEmail,
      message: teamMessage,
    });
    alert('Inquiry sent! (Check console for data)');
    // Optionally, clear the form
    setTeamName('');
    setTeamEmail('');
    setTeamMessage('');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
      {/* Uncomment this if it's part of the layout */}
      <div className="logo-sm"><img src="/media/qrobotics-logo.png" alt="QRobotics Small Logo"/></div>
      <div className="container-mini">
        <div className="left-side"><img src="/media/geargift-white.png" alt="Geargift White"/></div>
        <div className="right-side">
          <form onSubmit={handleSubmit}> {/* Use a form element */}
            <div className="inputs">
              <h1>Do you have a special request?</h1>
              <input
                className="team-name"
                placeholder="Ex: Quantum Robotics"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
              <input
                type="email" // Add type for better validation/UX
                className="team-email"
                placeholder="Ex: quantum.robotics@ichb.ro"
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
                required
              />
              <textarea
                className="team-message"
                placeholder="Your message..." // Added placeholder
                value={teamMessage}
                onChange={(e) => setTeamMessage(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="send-button">Send Inquiry</button> {/* Changed to button type submit */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InquiriesPage;