// filepath: geargift-react/src/pages/InquiriesPage.jsx
import { useState } from 'react';
import { useFirebase } from '../firebase/FirebaseContext';

function InquiriesPage() {
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamMessage, setTeamMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { addInquiry } = useFirebase();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!teamName || !teamEmail || !teamMessage) {
      alert('Please fill in all fields.');
      return;
    }
    
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Send to Firebase
      const inquiryData = {
        name: teamName,
        email: teamEmail,
        message: teamMessage,
      };
      
      await addInquiry(inquiryData);
      
      // Reset form
      setTeamName('');
      setTeamEmail('');
      setTeamMessage('');
      setSubmitMessage('Your inquiry has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitMessage(`Error submitting inquiry: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
      <div className="logo-sm"><img src="/media/qrobotics-logo.png" alt="QRobotics Small Logo"/></div>
      <div className="container-mini">
        <div className="left-side"><img src="/media/geargift-white.png" alt="Geargift White"/></div>
        <div className="right-side">
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <h1>Do you have a special request?</h1>
              <input
                className="team-name"
                placeholder="Ex: Quantum Robotics"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                disabled={submitting}
              />
              <input
                type="email"
                className="team-email"
                placeholder="Ex: quantum.robotics@ichb.ro"
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
                required
                disabled={submitting}
              />
              <textarea
                className="team-message"
                placeholder="Your message..."
                value={teamMessage}
                onChange={(e) => setTeamMessage(e.target.value)}
                required
                disabled={submitting}
              ></textarea>
              <button type="submit" className="send-button" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
              {submitMessage && (
                <p style={{ color: submitMessage.includes('Error') ? 'red' : 'green' }}>
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InquiriesPage;