export interface Recipe {
  id: string;
  title: string;
  category: 'Meethas' | 'Khadan' | 'Main' | 'Salad';
  description: string;
  image: string;
  time: string;
  servings: string;
  servingCount: number;
  flavorProfile: 'Khatt-Mitth' | 'Zaikedaar' | 'Kurkura' | 'Masaledaar' | 'Malai' | 'Dhungaar' | 'Kharas';
  cuisineType: 'Traditional' | 'Fusion';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: string[];
  substitutions?: { original: string; substitute: string }[];
  instructions: string[];
  heritage: string;
  verified?: boolean;
}

export interface ThaalPlan {
  id: string;
  title: string;
  guestCount: number;
  dishes: {
    sequence: number;
    type: 'Meethas' | 'Khara' | 'Main' | 'Salad/Side';
    platingPhysics: {
      location: string;
      temp: string;
      vesselMaterial: 'Kansi' | 'Steel' | 'Ceramic' | 'Silver-Plated';
    };
    chefIntuition: string;
    mastersFix: string;
    recipe: Recipe;
  }[];
  masterCritique: string;
  engineeringAudit: {
    criticalPath: string;
    bottleneckDish: string;
    vesselInventory: string[];
    scaleAdjustments: string;
  };
  qaAudit: {
    scorecard: {
      metric: string;
      score: number; // 0-100
      critique: string;
    }[];
    hazardWarnings: {
      type: 'Hygiene' | 'Ritual' | 'Logistics';
      severity: 'Low' | 'High' | 'CRITICAL';
      message: string;
    }[];
  };
  securityAudit: {
    traditionIntegrity: string;
    physicalSecurity: string;
    authenticityFirewall: {
      status: 'VERIFIED' | 'COMPROMISED';
      notes: string;
    };
  };
  releaseAudit: {
    deploymentReadiness: string;
    failoverProtocol: string;
    scalingPhysics: string;
    ritualLatency: 'Low' | 'Moderate' | 'High';
  };
  logisticalAudit: {
    frictionPoints: string[];
    chaosFactor: number;
    bohIntegrity: 'SOLID' | 'VULNERABLE';
    agentRecommendation: string;
  };
  strategicAudit: {
    resourceOptimization: string;
    marketReadiness: 'Private' | 'Celebration' | 'Industrial';
    theLeaver: string;
    strategicMoat: string;
  };
  independentReview: {
    brutalTake: string;
    greatestWeakness: string;
    enhancementValue: string;
    contrarianTake: string;
  };
  safetyAudit: {
    foodSafetyCCPs: string[];
    physicalHazards: string[];
    ritualSafetyProtocol: string;
    emergencyFailover: string;
  };
  documentationAudit: {
    hostSop: string;
    serverSop: string;
    guestProtocolBrief: string;
    glossary: {
      term: string;
      meaning: string;
    }[];
  };
  timeline: {
    stage: string;
    track: 'Active Cooking' | 'Host Rituals' | 'Prep/Plating';
    timeRelative: string; // e.g., "T - 2 hours"
    action: string;
    sensoryCue: string;
    dishId: string;
    role: 'Chef' | 'Host';
  }[];
  pairingNotes: string;
  complementarySuggestions: {
    dishType: string;
    suggestedFlavor: string;
    reason: string;
  }[];
  etiquette: {
    ritual: string;
    instruction: string;
  }[];
  chefSecret: string;
  atmosphere: {
    lighting: string;
    scent: string;
    vibe: string;
  };
}

export interface Profile {
  name: string;
  desc: string;
}
