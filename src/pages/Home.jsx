import React from 'react';
import { Phone, Mic, Camera, MapPin, AlertOctagon, UserPlus, Calculator, Edit3, Pin } from 'lucide-react';
import { CardButton } from '../components/CardButton';
import { useAppContext } from '../contexts/AppContext';

export const Home = ({ navigate }) => {
  const { notes, speak } = useAppContext();
  const pinnedNotes = (Array.isArray(notes) ? notes : []).filter(n => n.pinned).slice(0, 3);

  const handleNavigate = (page, announcement) => {
    speak(announcement);
    navigate(page);
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 className="text-huge" style={{ color: 'var(--primary-color)' }}>Nanna Connect</h1>
      </div>

      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        <CardButton 
          icon={Phone} 
          title="కాల్ చేయండి" 
          subtitle="Call Contact"
          onClick={() => handleNavigate('CallContact', 'కాల్ చేయడానికి కాంటాక్ట్ ఎంచుకోండి')} 
        />
        <CardButton 
          icon={Mic} 
          title="మెసేజ్ పంపండి" 
          subtitle="Voice Message"
          onClick={() => handleNavigate('VoiceMessage', 'మెసేజ్ చెప్పండి')} 
        />
        <CardButton 
          icon={Camera} 
          title="ఫోటో పంపండి" 
          subtitle="Send Photo"
          onClick={() => handleNavigate('SendPhoto', 'ఫోటో పంపడానికి ఎంచుకోండి')} 
        />
        <CardButton 
          icon={MapPin} 
          title="లొకేషన్ పంపండి" 
          subtitle="Share Location"
          onClick={() => handleNavigate('ShareLocation', 'లొకేషన్ పంపుతున్నాము')} 
        />
        <CardButton 
          icon={AlertOctagon} 
          title="సహాయం" 
          subtitle="Emergency"
          variant="danger"
          onClick={() => handleNavigate('Emergency', 'సహాయం కావాలా?')} 
        />
        <CardButton 
          icon={UserPlus} 
          title="కాంటాక్ట్ జోడించండి" 
          subtitle="Add Contact"
          onClick={() => handleNavigate('AddContact', 'కొత్త కాంటాక్ట్ జోడించండి')} 
        />
        <CardButton 
          icon={Calculator} 
          title="క్యాలిక్యులేటర్" 
          subtitle="Calculator"
          onClick={() => handleNavigate('Calculator', 'క్యాలిక్యులేటర్ వాడుదాం')} 
        />
        <CardButton 
          icon={Edit3} 
          title="త్వరిత నోట్స్" 
          subtitle="Quick Notes"
          onClick={() => handleNavigate('QuickNotes', 'నోట్స్ రాయండి లేదా చదవండి')} 
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--card-background)', 
          padding: '16px', 
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 className="text-large" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary-color)' }}>
            <Pin /> Pinned Notes (ముఖ్యమైనవి)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(Array.isArray(pinnedNotes) ? pinnedNotes : []).map(note => (
              <button 
                key={note.id}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid #eee',
                  backgroundColor: '#f8f9fa',
                  textAlign: 'left',
                  fontSize: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => speak(note.text)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {note.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
