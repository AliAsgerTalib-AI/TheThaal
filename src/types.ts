export interface Recipe {
  id: string;
  title: string;
  category: 'Meethas' | 'Kharaas' | 'Jamaan' | 'Salad';
  description: string;
  image: string;
  time: string;
  servings: string;
  servingCount: number;
  flavorProfile: 'Khatta-Mitth' | 'Zaikedaar' | 'Kurkura' | 'Masaledaar' | 'Malai' | 'Dhungaar' | 'Kharas';
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
    type: 'Meethas' | 'Kharaas' | 'Jamaan' | 'Salad/Side';
    platingPhysics: {
      location: string;
      temp: string;
      vesselMaterial: 'Kansa' | 'Steel' | 'Ceramic' | 'Silver-Plated';
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
  masterChefAudit: {
    brutalTake: string;
    greatestWeakness: string;
    strategicEnhancement: string;
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
    coordinationNote: string;
    atmosphericTrigger: string;
    dishId: string;
    role: 'Chef' | 'Host' | 'Server';
  }[];
  pairingNotes: string;
  condiments: {
    name: string;
    type: 'Pickle' | 'Chutney' | 'Raita' | 'Murabba';
    description: string;
    pairingLogic: string;
  }[];
  complementarySuggestions: {
    dishType: string;
    suggestedFlavor: string;
    reason: string;
  }[];
  etiquette: {
    ritual: string;
    instruction: string;
  }[];
  combinationsAudit: {
    selectionLogic: string;
    allowedSubstitutions: {
      original: string;
      substitute: string;
      reason: string;
    }[];
    forbiddenSubstitutions: {
      dish: string;
      forbidden: string;
      consequence: string;
    }[];
    tasteSymphony: string;
    textureMapping: string;
    palateModulation: string;
    flavorProgression: {
      course: string;
      transition: string;
      palateEffect: string;
    }[];
    efficiencySecrets: string;
    costLevers: string;
    efficiencyAnalysis: string;
    costOptimization: string;
  };
  chefSecret: string;
  atmosphere: {
    lighting: string;
    scent: string;
    vibe: string;
  };
  masterLogistics: {
    ingredients: {
      item: string;
      baseQuantity: string;
      scaledQuantity: string;
      emergencyBuffer: string;
      totalProcurement: string;
      purpose: string;
    }[];
    equipment: {
      utensil: string;
      quantity: number;
      useCase: string;
    }[];
    infrastructure: {
      stovesNeeded: number;
      kitchenStaff: number;
      servingStaff: number;
      powerRequirements?: string;
    };
    thaalCutlery: {
      item: string;
      quantityPerThaal: number;
      totalNeeded: number;
      wastageBuffer: number;
    }[];
  };
}

export interface Profile {
  name: string;
  desc: string;
}
