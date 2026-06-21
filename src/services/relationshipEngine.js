import { FEATURES } from '../config/featureFlags';
import { relationshipDictionary } from '../utils/relationshipDictionary';

export const relationshipEngine = {
  detectRelationship: (transcript) => {
    if (!FEATURES.RELATIONSHIP_INTELLIGENCE) {
      return null;
    }
    
    if (!transcript) return null;
    const lowerTranscript = transcript.toLowerCase();
    
    for (const [rel, keywords] of Object.entries(relationshipDictionary)) {
      for (const keyword of keywords) {
        if (lowerTranscript.includes(keyword.toLowerCase())) {
          return {
            action: 'call_relationship',
            relationship: rel,
            confidence: 0.95
          };
        }
      }
    }
    
    return null;
  }
};
