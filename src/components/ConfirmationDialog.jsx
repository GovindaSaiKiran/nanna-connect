import React from 'react';
import { Volume2, X, Check } from 'lucide-react';

export const ConfirmationDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  onListen,
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmVariant = "success"
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--card-background)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '24px',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h2 className="text-huge" style={{ textAlign: 'center', color: 'var(--primary-color)' }}>{title}</h2>
        
        {message && (
          <p className="text-large" style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
            {message}
          </p>
        )}

        {onListen && (
          <button 
            className="btn-massive btn-outline" 
            onClick={onListen}
            style={{ minHeight: '80px' }}
          >
            <Volume2 className="icon" style={{ fontSize: '2rem' }} />
            <span>Listen (వినండి)</span>
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <button 
            className="btn-massive btn-danger"
            onClick={onCancel}
          >
            <X className="icon" />
            <span>{cancelText}</span>
          </button>
          
          <button 
            className={`btn-massive btn-${confirmVariant}`}
            onClick={onConfirm}
          >
            <Check className="icon" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
