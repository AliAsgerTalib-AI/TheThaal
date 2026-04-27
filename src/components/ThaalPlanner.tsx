import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Clock, ChefHat, Sparkles, Wand2, ArrowRight, Play, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Settings, ShieldAlert, Activity, Trophy, AlertTriangle, Lock, Eye, EyeOff, Rocket, Zap, FileText, Library, Globe, Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { ThaalPlan, Recipe } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface ThaalPlannerProps {
  onClose: () => void;
  onStartKitchenMode: (recipe: Recipe) => void;
}

export function ThaalPlanner({ onClose, onStartKitchenMode }: ThaalPlannerProps) {
  const [thaalCount, setThaalCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<ThaalPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'audits' | 'combinations' | 'logistics'>('overview');
  const [expandedDishIndex, setExpandedDishIndex] = useState<number | null>(null);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [isChallenging, setIsChallenging] = useState<number | null>(null);
  const [challengeResponse, setChallengeResponse] = useState<string | null>(null);

  const challengeTheMaster = async (dishIndex: number) => {
    if (!plan) return;
    setIsChallenging(dishIndex);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    const dish = plan.dishes[dishIndex];
    
    const prompt = `As a master Bohra Chef, a user is challenging course #${dish.sequence}: ${dish.recipe.title}. 
    They think there's a ritual or balance issue. 
    Defend the orchestration with a short, authoritative, but informative 100-word response that explains why THIS course is essential at THIS moment for the Barakat of the Thaal. Mention specific Bohra traditions.`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      const text = result.candidates[0].content.parts[0].text;
      setChallengeResponse(text || "The Master nods in silent agreement.");
    } catch (error) {
      setChallengeResponse("The Master remains silent. (Error connecting to the Daawat expert)");
    }
  };

  const generateThaalPlan = async () => {
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const totalGuests = thaalCount * 8;

    const prompt = `Act as a master Dawoodi Bohra Thaal Orchestrator with 40 years of experience.
    Create a complete Thaal Plan for ${thaalCount} Thaals (Total Guests: ${totalGuests}). Note: Each Thaal serves exactly 8 people.
    
    A Thaal must follow the traditional sequence: 
    1. First Meethas (Sweet)
    2. First Khara (Savory)
    3. Second Meethas
    4. Second Khara
    5. Main Course (Gavri/Jaman)
    6. Accompaniments (Salads/Dips)
    
    Requirements:
    - DISHES: Provide exactly 6 courses following the above sequence. Each dish must be a full recipe object. No summaries, no omissions.
    - LOGISTICS: Provide a TRULY EXHAUSTIVE AND NON-ABBREVIATED Master Procurement & Infrastructure List.
        1. INGREDIENTS: A complete master list including EVERY SINGLE ITEM, SPICE, AND GARNISH required across all recipes. List at least 50+ specific items (e.g. Saffron, Green Cardamom, Cloves, Cinnamon sticks, Star Anise, Mace, Stone-pounded Cumin, various Chilies, Ghee, Jaggery, specialized salts, fresh Mint, Coriander, Fried Onions, Rose water, Kewra, etc.). 
           - item: Precise name of ingredient/spice.
           - baseQuantity: Quantity for 1 guest.
           - scaledQuantity: Quantity for ${totalGuests} guests.
           - emergencyBuffer: Extra quantity (25-30%) for emergencies, wastage, or spoilage.
           - totalProcurement: Exact sum of scaled + emergency buffer.
           - purpose: Which dishes or courses use this item. Be specific.
        2. EQUIPMENT: Exhaustive list of EVERY cooking utensil and specialized vessel (including Patiya, Deg, Langri, Kundi, frying pans, stirrers, sieves, specific size ladles, weighing scales, etc.) and quantities needed.
        3. INFRASTRUCTURE: Exact number of commercial stoves needed, total kitchen staff (Heads, Comis, Dishwashers, Prep-cooks), and serving staff (for Safra rotation and water service).
        4. THAAL CUTLERY: Exhaustive list of every single item required at the Thaal (including Sini, Safra, Glasses, Spoons, Chalamu, Pardi, Napkins, Finger bowls, Tarkati, Salt/Pepper shakers, etc.).
           - quantityPerThaal: Standard for 1 Thaal (8 guests).
           - totalNeeded: scaled for ${thaalCount} Thaals.
           - wastageBuffer: 15% extra for breakage or loss.
    - CHEF'S INTUITION: For each dish, provide a "Chef's Intuition" — a short, sensory description of the EXACT moment the dish is perfect.
    - PLATING PHYSICS: Describe the exact bowl placement, vessel material (Kansi, Steel, Ceramic, Silver-Plated), and the required temperature of the vessel itself.
    - TROUBLESHOOTING: For EACH dish, provide one "Master's Fix".
    - TIMELINE: Generate a extremely high-granularity synchronized sequence (20-25+ steps) across 3 tracks: "Active Cooking", "Host Rituals", and "Prep/Plating". 
    - COORDINATION: Every step MUST include a "coordinationNote" (orchestration details between BOH and Safra) and an "atmosphericTrigger" (specific lighting/scent/ambience shifts).
    - ROLES: Every timeline step MUST have a role of "Chef", "Host", or "Server".
    - SENSORY CUES: For each timeline step, provide a precise sensory cue.
    - ATMOSPHERE: Provide instructions for Lighting, Scent, and Vibe.
    - ETIQUETTE: 3 specific rituals.
    - ZUBAAN-NI-CHATAS: Provide 2-3 palate cleansers/condiments (Pickle, Chutney, Raita, or Murabba) that perfectly COMPLEMENT the specific dishes in this plan. Explain the "Pairing Logic" (why it fits the mood/flavor).
    - MASTER'S CRITIQUE: Provide a 2-sentence "Brutal Take" on the balance of THIS specific plan from the perspective of a 30-year Daawat veteran.
    - ENGINEERING AUDIT: Provide a technical assessment including the "Critical Path" (the process that cannot be delayed), the "Bottleneck Dish", a list of specialized Bohra vessels needed (e.g. Sini, Kundi, Patiya), and adjustment advice for scaling to 5+ Thaals.
    - QA AUDIT: Provide a rigorous QA assessment. 
        1. SCORECARD: 3 metrics (Balance, Complexity, Authentic Ritual Compliance) with a score 0-100 and a short critique.
        2. HAZARD WARNINGS: Identify any potential Hygiene, Ritual, or Logistics risks (e.g., "High Dairy risk in summer heat", "Ritual mismatch with sequence").
    - SECURITY AUDIT: Provide a high-level security/integrity assessment.
        1. TRADITION INTEGRITY: How well does this protect the "Sanctity of the Thaal"?
        2. PHYSICAL SECURITY: Critical logistics warnings (e.g., vessel weighting, pardi placement).
        3. AUTHENTICITY FIREWALL: A status of VERIFIED or COMPROMISED based on ingredients/sequence.
    - RELEASE AUDIT: Provide a deployment readiness assessment.
        1. DEPLOYMENT READINESS: Is this plan ready for a 100-Thaal high-speed event?
        2. FAILOVER PROTOCOL: What is the backup if a primary dish fails?
        3. SCALING PHYSICS: What changes when moving from 1 Thaal to massive scale?
        4. RITUAL LATENCY: Assessment (Low/Moderate/High) of time delays caused by host rituals.
    - LOGISTICAL AUDIT: Provide a Browser Agent/Logistics expert's "Brutal Take" on UI/UX in the kitchen.
        1. FRICTION POINTS: 2-3 moments where the plan might fail due to physical stress (e.g., "Too many timed steps for a solo chef").
        2. CHAOS FACTOR: A score 0-100 representing how sensitive this plan is to guest delays.
        3. BOH INTEGRITY: Status (SOLID or VULNERABLE).
        4. AGENT RECOMMENDATION: One contrarian recommendation to improve execution.
    - MASTER CHEF'S AUDIT: Provide a 40-year Master Chef's "Brutal Take".
        1. BRUTAL TAKE: Honest, blunt assessment of the plan's soul.
        2. GREATEST WEAKNESS: Identify the one critical failure point.
        3. STRATEGIC ENHANCEMENT: One high-level strategic enhancement.
        4. CONTRARIAN TAKE: A "Master's Command" that goes against modern convenience.
    - SAFETY AUDIT: Provide a rigorous 30-year Safety Officer's assessment.
        1. FOOD SAFETY CCPs: Identify 2-3 Critical Control Points (e.g., cooling times for Malida).
        2. PHYSICAL HAZARDS: Risks like "Scalding risk during Sini lift" or "Slip risk near Wash-Basin".
        3. RITUAL SAFETY: Safe handling of Lohban (incense) or candles during the meal.
        4. EMERGENCY FAILOVER: Response plan for a dropped Thaal or medical incident in the Safra.
    - STRATEGIC AUDIT: Provide a 30-year Strategist's "Brutal Take".
        1. RESOURCE OPTIMIZATION: Assessment of efficiency (Time/Labor).
        2. MARKET READINESS: Selection (Private/Celebration/Industrial).
        3. THE LEAVER: One course or element to EXCLUDE to improve the strategic impact of the remaining meal (Contrarian).
        4. STRATEGIC MOAT: What makes this Daawat unforgettable/unbeatable from a business/heritage perspective?
    - COMBINATIONS AUDIT: Provide a master-level analysis of the dish combinations. 
        1. SELECTION LOGIC: Why these specific dishes were paired together.
        2. TASTE SYMPHONY: A deep breakdown of flavor progression (Sweet, Salt, Sour, Umami) and how they peak.
        3. TEXTURE MAPPING: How mouthfeel evolves (Crispy vs Creamy vs Rough).
        4. PALATE MODULATION: How a dish prepares the palate for the next course.
        5. FLAVOR PROGRESSION: A detailed course-by-course breakdown of flavor evolution for the entire meal. There MUST be exactly one entry for each of the 6 courses.
           - course: The dish name or course type.
           - transition: How the flavor shifts from the previous dish.
           - palateEffect: The sensory impact on the guest's palate.
        6. ALLOWED SUBSTITUTIONS: List 4 safe swaps with detailed reasons.
        7. FORBIDDEN SUBSTITUTIONS: List 4 illegal swaps and the specific chemical or ritual consequence.
        8. EFFICIENCY SECRETS: Kitchen-relay hacks (e.g. shared base gravies).
        9. COST LEVERS: How high-value ingredients are balanced by strategic volume fillers.
        10. EFFICIENCY ANALYSIS: Overall kitchen throughput optimization.
        11. COST OPTIMIZATION: Wastage management.
    - DOCUMENTATION AUDIT: Provide a Heritage Codex assessment.
        1. HOST SOP: Precise behavioral instructions for the Host during the Daawat.
        2. SERVER SOP: Logistics for servers (how to carry Sini, how to rotate dishes).
        3. GUEST PROTOCOL BRIEF: 2-3 sentences to share with guests to explain the meaning of this specific meal.
        4. GLOSSARY: 3-4 specialized terms used in this plan (e.g., Sini, Kundi, Safra, Chalamu) with brief meanings.
    - CHEF SECRET: Professional secret.
    - COMPLEMENTARY SUGGESTIONS: 2-3 additional items linked to dishes.
    
    Output format MUST be JSON:
    {
      "title": "string",
      "guestCount": number,
      "masterCritique": "string",
      "engineeringAudit": {
        "criticalPath": "string",
        "bottleneckDish": "string",
        "vesselInventory": ["string"],
        "scaleAdjustments": "string"
      },
      "qaAudit": {
        "scorecard": [{"metric": "string", "score": number, "critique": "string"}],
        "hazardWarnings": [{"type": "string", "severity": "string", "message": "string"}]
      },
      "securityAudit": {
        "traditionIntegrity": "string",
        "physicalSecurity": "string",
        "authenticityFirewall": {
          "status": "string",
          "notes": "string"
        }
      },
      "releaseAudit": {
        "deploymentReadiness": "string",
        "failoverProtocol": "string",
        "scalingPhysics": "string",
        "ritualLatency": "string"
      },
      "logisticalAudit": {
        "frictionPoints": ["string"],
        "chaosFactor": number,
        "bohIntegrity": "string",
        "agentRecommendation": "string"
      },
      "masterChefAudit": {
        "brutalTake": "string",
        "greatestWeakness": "string",
        "strategicEnhancement": "string",
        "contrarianTake": "string"
      },
      "safetyAudit": {
        "foodSafetyCCPs": ["string"],
        "physicalHazards": ["string"],
        "ritualSafetyProtocol": "string",
        "emergencyFailover": "string"
      },
      "strategicAudit": {
        "resourceOptimization": "string",
        "marketReadiness": "string",
        "theLeaver": "string",
        "strategicMoat": "string"
      },
      "combinationsAudit": {
        "selectionLogic": "string",
        "allowedSubstitutions": [{"original": "string", "substitute": "string", "reason": "string"}],
        "forbiddenSubstitutions": [{"dish": "string", "forbidden": "string", "consequence": "string"}],
        "efficiencyAnalysis": "string",
        "costOptimization": "string"
      },
      "masterLogistics": {
        "ingredients": [{"item": "string", "baseQuantity": "string", "scaledQuantity": "string", "emergencyBuffer": "string", "totalProcurement": "string", "purpose": "string"}],
        "equipment": [{"utensil": "string", "quantity": number, "useCase": "string"}],
        "infrastructure": {"stovesNeeded": number, "kitchenStaff": number, "servingStaff": number},
        "thaalCutlery": [{"item": "string", "quantityPerThaal": number, "totalNeeded": number, "wastageBuffer": number}]
      },
      "documentationAudit": {
        "hostSop": "string",
        "serverSop": "string",
        "guestProtocolBrief": "string",
        "glossary": [{"term": "string", "meaning": "string"}]
      },
      "pairingNotes": "string",
      "condiments": [
        {
          "name": "string",
          "type": "string",
          "description": "string",
          "pairingLogic": "string"
        }
      ],
      "dishes": [...],
      "timeline": [...],
      "etiquette": [...],
      "chefSecret": "string",
      "atmosphere": { ... },
      "complementarySuggestions": [...]
    }
    
    Ensure all recipes follow the Bohra culinary tradition strictly.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              guestCount: { type: Type.NUMBER },
              masterCritique: { type: Type.STRING },
              engineeringAudit: {
                type: Type.OBJECT,
                properties: {
                  criticalPath: { type: Type.STRING },
                  bottleneckDish: { type: Type.STRING },
                  vesselInventory: { type: Type.ARRAY, items: { type: Type.STRING } },
                  scaleAdjustments: { type: Type.STRING }
                },
                required: ["criticalPath", "bottleneckDish", "vesselInventory", "scaleAdjustments"]
              },
              qaAudit: {
                type: Type.OBJECT,
                properties: {
                  scorecard: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        metric: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        critique: { type: Type.STRING }
                      },
                      required: ["metric", "score", "critique"]
                    }
                  },
                  hazardWarnings: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ["Hygiene", "Ritual", "Logistics"] },
                        severity: { type: Type.STRING, enum: ["Low", "High", "CRITICAL"] },
                        message: { type: Type.STRING }
                      },
                      required: ["type", "severity", "message"]
                    }
                  }
                },
                required: ["scorecard", "hazardWarnings"]
              },
              securityAudit: {
                type: Type.OBJECT,
                properties: {
                  traditionIntegrity: { type: Type.STRING },
                  physicalSecurity: { type: Type.STRING },
                  authenticityFirewall: {
                    type: Type.OBJECT,
                    properties: {
                      status: { type: Type.STRING, enum: ["VERIFIED", "COMPROMISED"] },
                      notes: { type: Type.STRING }
                    },
                    required: ["status", "notes"]
                  }
                },
                required: ["traditionIntegrity", "physicalSecurity", "authenticityFirewall"]
              },
              releaseAudit: {
                type: Type.OBJECT,
                properties: {
                  deploymentReadiness: { type: Type.STRING },
                  failoverProtocol: { type: Type.STRING },
                  scalingPhysics: { type: Type.STRING },
                  ritualLatency: { type: Type.STRING, enum: ["Low", "Moderate", "High"] }
                },
                required: ["deploymentReadiness", "failoverProtocol", "scalingPhysics", "ritualLatency"]
              },
              logisticalAudit: {
                type: Type.OBJECT,
                properties: {
                  frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  chaosFactor: { type: Type.NUMBER },
                  bohIntegrity: { type: Type.STRING, enum: ["SOLID", "VULNERABLE"] },
                  agentRecommendation: { type: Type.STRING }
                },
                required: ["frictionPoints", "chaosFactor", "bohIntegrity", "agentRecommendation"]
              },
              masterChefAudit: {
                type: Type.OBJECT,
                properties: {
                  brutalTake: { type: Type.STRING },
                  greatestWeakness: { type: Type.STRING },
                  strategicEnhancement: { type: Type.STRING },
                  contrarianTake: { type: Type.STRING }
                },
                required: ["brutalTake", "greatestWeakness", "strategicEnhancement", "contrarianTake"]
              },
              safetyAudit: {
                type: Type.OBJECT,
                properties: {
                  foodSafetyCCPs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  physicalHazards: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ritualSafetyProtocol: { type: Type.STRING },
                  emergencyFailover: { type: Type.STRING }
                },
                required: ["foodSafetyCCPs", "physicalHazards", "ritualSafetyProtocol", "emergencyFailover"]
              },
              strategicAudit: {
                type: Type.OBJECT,
                properties: {
                  resourceOptimization: { type: Type.STRING },
                  marketReadiness: { type: Type.STRING, enum: ["Private", "Celebration", "Industrial"] },
                  theLeaver: { type: Type.STRING },
                  strategicMoat: { type: Type.STRING }
                },
                required: ["resourceOptimization", "marketReadiness", "theLeaver", "strategicMoat"]
              },
              combinationsAudit: {
                type: Type.OBJECT,
                properties: {
                  selectionLogic: { type: Type.STRING },
                  allowedSubstitutions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        original: { type: Type.STRING },
                        substitute: { type: Type.STRING },
                        reason: { type: Type.STRING }
                      },
                      required: ["original", "substitute", "reason"]
                    }
                  },
                  forbiddenSubstitutions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dish: { type: Type.STRING },
                        forbidden: { type: Type.STRING },
                        consequence: { type: Type.STRING }
                      },
                      required: ["dish", "forbidden", "consequence"]
                    }
                  },
                  tasteSymphony: { type: Type.STRING },
                  textureMapping: { type: Type.STRING },
                  efficiencySecrets: { type: Type.STRING },
                  costLevers: { type: Type.STRING },
                  palateModulation: { type: Type.STRING },
                  flavorProgression: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        course: { type: Type.STRING },
                        transition: { type: Type.STRING },
                        palateEffect: { type: Type.STRING }
                      },
                      required: ["course", "transition", "palateEffect"]
                    }
                  },
                  efficiencyAnalysis: { type: Type.STRING },
                  costOptimization: { type: Type.STRING }
                },
                required: ["selectionLogic", "tasteSymphony", "textureMapping", "palateModulation", "flavorProgression", "allowedSubstitutions", "forbiddenSubstitutions", "efficiencySecrets", "costLevers", "efficiencyAnalysis", "costOptimization"]
              },
              masterLogistics: {
                type: Type.OBJECT,
                properties: {
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        baseQuantity: { type: Type.STRING },
                        scaledQuantity: { type: Type.STRING },
                        emergencyBuffer: { type: Type.STRING },
                        totalProcurement: { type: Type.STRING },
                        purpose: { type: Type.STRING }
                      },
                      required: ["item", "baseQuantity", "scaledQuantity", "emergencyBuffer", "totalProcurement", "purpose"]
                    }
                  },
                  equipment: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        utensil: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        useCase: { type: Type.STRING }
                      },
                      required: ["utensil", "quantity", "useCase"]
                    }
                  },
                  infrastructure: {
                    type: Type.OBJECT,
                    properties: {
                      stovesNeeded: { type: Type.NUMBER },
                      kitchenStaff: { type: Type.NUMBER },
                      servingStaff: { type: Type.NUMBER }
                    },
                    required: ["stovesNeeded", "kitchenStaff", "servingStaff"]
                  },
                  thaalCutlery: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        quantityPerThaal: { type: Type.NUMBER },
                        totalNeeded: { type: Type.NUMBER },
                        wastageBuffer: { type: Type.NUMBER }
                      },
                      required: ["item", "quantityPerThaal", "totalNeeded", "wastageBuffer"]
                    }
                  }
                },
                required: ["ingredients", "equipment", "infrastructure", "thaalCutlery"]
              },
              documentationAudit: {
                type: Type.OBJECT,
                properties: {
                  hostSop: { type: Type.STRING },
                  serverSop: { type: Type.STRING },
                  guestProtocolBrief: { type: Type.STRING },
                  glossary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        meaning: { type: Type.STRING }
                      },
                      required: ["term", "meaning"]
                    }
                  }
                },
                required: ["hostSop", "serverSop", "guestProtocolBrief", "glossary"]
              },
              pairingNotes: { type: Type.STRING },
              condiments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["Pickle", "Chutney", "Raita", "Murabba"] },
                    description: { type: Type.STRING },
                    pairingLogic: { type: Type.STRING }
                  },
                  required: ["name", "type", "description", "pairingLogic"]
                }
              },
              dishes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sequence: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    platingPhysics: {
                      type: Type.OBJECT,
                      properties: {
                        location: { type: Type.STRING },
                        temp: { type: Type.STRING },
                        vesselMaterial: { type: Type.STRING, enum: ["Kansa", "Steel", "Ceramic", "Silver-Plated"] }
                      },
                      required: ["location", "temp", "vesselMaterial"]
                    },
                    chefIntuition: { type: Type.STRING },
                    mastersFix: { type: Type.STRING },
                    recipe: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        time: { type: Type.STRING },
                        servings: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        heritage: { type: Type.STRING },
                        image: { type: Type.STRING }
                      },
                      required: ["id", "title", "description", "time", "ingredients", "instructions", "heritage", "image"]
                    }
                  },
                  required: ["sequence", "type", "recipe", "platingPhysics", "chefIntuition", "mastersFix"]
                }
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING },
                    track: { type: Type.STRING, enum: ["Active Cooking", "Host Rituals", "Prep/Plating"] },
                    timeRelative: { type: Type.STRING },
                    action: { type: Type.STRING },
                    sensoryCue: { type: Type.STRING },
                    coordinationNote: { type: Type.STRING },
                    atmosphericTrigger: { type: Type.STRING },
                    dishId: { type: Type.STRING },
                    role: { type: Type.STRING }
                  },
                  required: ["stage", "timeRelative", "action", "role", "sensoryCue", "coordinationNote", "atmosphericTrigger"]
                }
              },
              etiquette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ritual: { type: Type.STRING },
                    instruction: { type: Type.STRING }
                  },
                  required: ["ritual", "instruction"]
                }
              },
              chefSecret: { type: Type.STRING },
              atmosphere: {
                type: Type.OBJECT,
                properties: {
                  lighting: { type: Type.STRING },
                  scent: { type: Type.STRING },
                  vibe: { type: Type.STRING }
                },
                required: ["lighting", "scent", "vibe"]
              },
              complementarySuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dishType: { type: Type.STRING },
                    suggestedFlavor: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["dishType", "suggestedFlavor", "reason"]
                }
              }
            },
            required: ["title", "guestCount", "masterCritique", "engineeringAudit", "qaAudit", "securityAudit", "releaseAudit", "logisticalAudit", "masterChefAudit", "safetyAudit", "strategicAudit", "combinationsAudit", "masterLogistics", "documentationAudit", "pairingNotes", "condiments", "dishes", "timeline", "etiquette", "chefSecret", "atmosphere", "complementarySuggestions"]
          }
        }
      });
      
      console.log("AI Response received, parsing...");
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      
      try {
        const parsedPlan = JSON.parse(text);
        setPlan(parsedPlan);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, text);
        throw new Error("The Orchestrator's recipe was too complex to decode. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate Thaal plan:", error);
      alert("The Orchestrator encountered a culinary complexity: " + (error instanceof Error ? error.message : "Synchronization failed."));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen relative transition-colors duration-500 ${
        kitchenMode ? 'bg-black' : 'bg-brand-bg/95 backdrop-blur-2xl'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 pt-32 pb-20 ${kitchenMode ? 'font-mono' : ''}`}>
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className={`uppercase text-[10px] tracking-mega font-bold mb-4 transition-colors ${
              kitchenMode ? 'text-red-500' : 'text-brand-gold'
            }`}>Elite Dawat Management</h2>
            <h1 className={`text-6xl font-serif transition-colors ${
              kitchenMode ? 'text-white' : 'text-brand-cream'
            }`}>Thaal Orchestration</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {plan && (
              <button 
                onClick={() => setKitchenMode(!kitchenMode)}
                className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  kitchenMode 
                    ? 'bg-red-500 text-black border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                    : 'glass-card text-brand-gold hover:bg-brand-gold/10'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${kitchenMode ? 'animate-pulse' : ''}`} />
                {kitchenMode ? 'Kitchen Interface Active' : 'Enter Kitchen Mode'}
              </button>
            )}
          </div>
        </div>

        {!plan ? (
          <div className="max-w-xl mx-auto text-center space-y-12 py-20">
            <div className="space-y-6">
              <div className="flex justify-center mb-10">
                <div className="w-24 h-24 rounded-full border border-brand-gold/20 flex items-center justify-center bg-brand-gold/5 relative">
                  <ChefHat className="w-10 h-10 text-brand-gold" />
                  <div className="absolute inset-0 rounded-full border border-brand-gold/40 animate-ping opacity-20" />
                </div>
              </div>
              <p className="text-white/60 font-light leading-relaxed text-lg italic">
                "The Thaal is not a collection of recipes; it is the orchestration of Barakat (blessing), hospitality, and sensory rhythm."
              </p>
              <p className="text-white/40 text-sm">
                As an expert with 40 years in the Dawat, I will calculate the precise sequence of Meethas and Khara to ensure your guests experience the pinnacle of Bohra culinary heritage.
              </p>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block">Number of Thaals (8 Guests Each)</label>
              <div className="flex items-center justify-center gap-8">
                <button 
                  onClick={() => setThaalCount(Math.max(1, thaalCount - 1))}
                  className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-2xl text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all"
                >
                  -
                </button>
                <div className="flex items-center gap-4">
                  <Library className="w-6 h-6 text-brand-gold" />
                  <div className="flex flex-col items-center">
                    <span className="text-5xl font-serif text-brand-cream">{thaalCount}</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Thaals</span>
                  </div>
                </div>
                <button 
                  onClick={() => setThaalCount(thaalCount + 1)}
                  className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-2xl text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all"
                >
                  +
                </button>
              </div>
              <div className="text-white/20 text-[10px] uppercase font-bold tracking-widest">
                Serving Approximately {thaalCount * 8} Guests
              </div>
            </div>

            <button 
              onClick={generateThaalPlan}
              disabled={isGenerating}
              className="w-full py-6 bg-brand-gold text-brand-bg uppercase font-bold tracking-mega text-[10px] hover:bg-white transition-all shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-4"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" /> Orchestrating the Symphony...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" /> Generate Master Plan
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-end justify-between border-b border-white/10 pb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" /> Orchestration Complete
                </div>
                <h2 className="text-4xl font-serif text-brand-cream">{plan.title}</h2>
                <p className="text-white/40 max-w-2xl font-light italic">"{plan.pairingNotes}"</p>
              </div>
              
              <div className="flex gap-4">
                {[
                  { id: 'overview', label: 'The Experience' },
                  { id: 'timeline', label: 'Synchronized Timeline' },
                  { id: 'logistics', label: 'Master List' },
                  { id: 'audits', label: 'Expert Audits' },
                  { id: 'combinations', label: 'Combinations' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-gold text-brand-bg' : 'text-white/40 border border-white/10'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' ? (
              <div className="max-w-7xl mx-auto py-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {plan?.dishes?.map((dish, i) => (
                    <div key={i} className={`glass-card overflow-hidden group transition-all duration-500 ${expandedDishIndex === i ? 'ring-2 ring-brand-gold/40 col-span-full' : 'hover:border-brand-gold/40'}`}>
                        <div className="p-8 space-y-6">
                           <div className="flex items-center justify-between">
                             <div className="bg-brand-gold/10 px-3 py-1 rounded text-[9px] font-bold text-brand-gold uppercase tracking-widest">
                               COURSE {dish.sequence}
                             </div>
                             <button 
                               onClick={() => setExpandedDishIndex(expandedDishIndex === i ? null : i)}
                               className="p-2 rounded-full hover:bg-white/5 text-brand-gold hover:text-white transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                             >
                               {expandedDishIndex === i ? 'Collapse' : 'View Recipe'}
                               {expandedDishIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                             </button>
                           </div>

                           <h3 className="text-4xl font-serif text-brand-cream font-bold leading-tight group-hover:text-brand-gold transition-colors">
                             {dish.recipe.title}
                           </h3>

                           <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
                              <span>{dish.type}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dish.recipe.time}</span>
                           </div>
                           
                           <p className="text-sm text-white/60 font-light leading-relaxed">
                             {dish.recipe.description}
                           </p>

                           <AnimatePresence>
                             {expandedDishIndex === i && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden space-y-8 pt-6 border-t border-white/5"
                               >
                                 <div className="bg-brand-gold/5 p-6 rounded-lg border border-brand-gold/20">
                                   <h5 className="text-[10px] uppercase font-bold tracking-widest text-brand-gold mb-3 flex items-center gap-2">
                                     <Sparkles className="w-3 h-3" /> Chef's Intuition
                                   </h5>
                                   <p className="text-lg font-serif text-brand-cream italic mb-6">"{dish.chefIntuition}"</p>
                                   
                                   <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-white/5 rounded">
                                       <span className="text-[8px] uppercase font-bold text-brand-gold/60 block mb-1">Vessel Material</span>
                                       <span className="text-[11px] font-bold text-brand-cream">{dish.platingPhysics.vesselMaterial}</span>
                                     </div>
                                     <div className="p-4 bg-white/5 rounded">
                                       <span className="text-[8px] uppercase font-bold text-brand-gold/60 block mb-1">Vessel Temp</span>
                                       <span className="text-[11px] font-bold text-brand-cream">{dish.platingPhysics.temp}</span>
                                     </div>
                                   </div>

                                   <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded">
                                      <h6 className="text-[9px] uppercase font-bold text-red-400 mb-2">The Master's Fix (Crisis Control)</h6>
                                      <p className="text-xs text-white/60 leading-relaxed italic">{dish.mastersFix}</p>
                                   </div>

                                   <div className="pt-4 mt-4 border-t border-white/5">
                                      <button 
                                        onClick={() => challengeTheMaster(i)}
                                        disabled={isChallenging === i}
                                        className="text-[9px] uppercase font-bold tracking-widest text-brand-gold hover:text-white flex items-center gap-2"
                                      >
                                        <ShieldAlert className="w-3 h-3" /> 
                                        {isChallenging === i ? 'Challenging...' : 'Challenge Choice (Expert Mode)'}
                                      </button>
                                      {challengeResponse && isChallenging === i && (
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="mt-4 p-4 bg-white/5 border-l-2 border-brand-gold text-[11px] italic text-brand-cream/80 leading-relaxed"
                                        >
                                          {challengeResponse}
                                        </motion.div>
                                      )}
                                   </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="space-y-4">
                                     <h5 className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Ingredients</h5>
                                     <ul className="space-y-2">
                                       {dish.recipe.ingredients?.map((ing, k) => (
                                         <li key={k} className="text-xs text-white/50 font-light flex items-center gap-2">
                                           <div className="w-1 h-1 rounded-full bg-brand-gold/30" /> {ing}
                                         </li>
                                       ))}
                                     </ul>
                                   </div>
                                   <div className="space-y-4">
                                     <h5 className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Instructions</h5>
                                     <ul className="space-y-3">
                                       {dish.recipe.instructions?.map((step, k) => (
                                         <li key={k} className="text-xs text-white/40 font-light leading-relaxed">
                                           <span className="text-brand-gold/50 font-bold mr-2">{k + 1}.</span> {step}
                                         </li>
                                       ))}
                                     </ul>
                                   </div>
                                 </div>
                                 <div className="bg-white/3 p-6 border-l-2 border-brand-gold/30 italic text-xs text-white/40 leading-relaxed">
                                   <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-widest text-[9px] text-brand-gold/50 not-italic">
                                     <BookOpen className="w-3 h-3" /> Cultural Heritage
                                   </div>
                                   {dish.recipe.heritage}
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>

                           <div className="flex gap-4">
                             <button 
                               onClick={() => onStartKitchenMode(dish.recipe)}
                               className="flex-1 py-4 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-brand-gold hover:bg-brand-gold hover:text-brand-bg transition-all flex items-center justify-center gap-2"
                             >
                               <Play className="w-3 h-3 fill-current" /> Open in Kitchen
                             </button>
                             {expandedDishIndex !== i && (
                               <button 
                                 onClick={() => setExpandedDishIndex(i)}
                                 className="px-6 py-4 glass-card text-white/30 hover:text-white transition-all"
                               >
                                 <BookOpen className="w-4 h-4" />
                               </button>
                             )}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zubaan-ni-Chatas (Condiments) Section */}
                  <div className="glass-card p-12 border-brand-gold/30 bg-brand-gold/5 mt-12">
                    <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-10 flex items-center gap-3">
                      <Sparkles className="w-4 h-4" /> Zubaan-ni-Chatas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {plan.condiments?.map((item, i) => (
                         <div key={i} className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-all">
                           <div className="flex items-center justify-between">
                             <span className="text-[8px] uppercase font-bold text-brand-gold/60 tracking-widest">{item.type}</span>
                           </div>
                           <div className="text-xl font-serif text-brand-cream">{item.name}</div>
                           <p className="text-xs text-white/50 font-light leading-relaxed">{item.description}</p>
                           <div className="pt-4 mt-4 border-t border-white/5">
                             <div className="flex items-center gap-2 mb-2 text-[9px] uppercase font-bold text-brand-gold/40">
                               <Target className="w-3 h-3" /> Pairing Logic
                             </div>
                             <p className="text-[10px] text-white/40 italic leading-relaxed">{item.pairingLogic}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Etiquette & Rituals Section */}
                  <div className="glass-card p-12 border-brand-gold/30 bg-brand-gold/5 mt-12">
                    <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-10 flex items-center gap-3">
                      <Sparkles className="w-4 h-4" /> The Adab of the Dawat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {plan.etiquette?.map((item, i) => (
                         <div key={i} className="space-y-4">
                           <div className="text-xl font-serif text-brand-cream">{item.ritual}</div>
                           <p className="text-sm text-white/50 font-light leading-relaxed">{item.instruction}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'logistics' ? (
              <div className="max-w-7xl mx-auto py-12 space-y-16">
                {/* Logistics Header */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="p-8 glass-card border-brand-gold/20 rounded-2xl flex flex-col justify-center items-center text-center">
                      <Users className="w-6 h-6 text-brand-gold mb-3" />
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Total Guests</div>
                      <div className="text-3xl font-serif text-brand-cream">{plan.guestCount}</div>
                   </div>
                   <div className="p-8 glass-card border-brand-gold/20 rounded-2xl flex flex-col justify-center items-center text-center">
                      <Target className="w-6 h-6 text-brand-gold mb-3" />
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Thaal Count</div>
                      <div className="text-3xl font-serif text-brand-cream">{plan.guestCount / 8}</div>
                   </div>
                   <div className="p-8 glass-card border-brand-gold/20 rounded-2xl flex flex-col justify-center items-center text-center">
                      <Activity className="w-6 h-6 text-brand-gold mb-3" />
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Scaling Factor</div>
                      <div className="text-3xl font-serif text-brand-cream">x{plan.guestCount}</div>
                   </div>
                   <div className="p-8 glass-card border-brand-gold/20 rounded-2xl flex flex-col justify-center items-center text-center">
                      <ShieldAlert className="w-6 h-6 text-brand-gold mb-3" />
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Safety Buffer</div>
                      <div className="text-3xl font-serif text-brand-cream">25%</div>
                   </div>
                </div>

                {/* Ingredients Master List */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-2">Procurement Directive</h3>
                      <h2 className="text-3xl font-serif text-brand-cream">Exhaustive Ingredient & Spice Inventory</h2>
                    </div>
                    <div className="px-6 py-3 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4" /> Comprehensive Audit
                    </div>
                  </div>

                  <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-brand-bg/95 backdrop-blur-md z-10">
                          <tr className="border-b border-white/10 text-left">
                            <th className="py-6 px-8 text-[10px] uppercase font-bold text-white/30 tracking-widest">Item / Detail</th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center">Per Guest</th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center text-brand-gold">Total Procurement</th>
                            <th className="py-6 px-8 text-[10px] uppercase font-bold text-white/30 tracking-widest text-right">Usage Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {plan.masterLogistics.ingredients.map((ing, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="py-6 px-8">
                                <div className="text-brand-cream font-medium group-hover:text-brand-gold transition-colors">{ing.item}</div>
                              </td>
                              <td className="py-6 px-4 text-center text-white/40 font-mono text-xs">{ing.baseQuantity}</td>
                              <td className="py-6 px-4 text-center">
                                <div className="text-brand-gold font-mono font-bold">{ing.totalProcurement}</div>
                                <div className="text-[8px] text-white/20 uppercase font-black tracking-tighter">Scaled + 25% Buffer</div>
                              </td>
                              <td className="py-6 px-8 text-right max-w-xs">
                                <span className="text-[10px] text-white/40 italic">{ing.purpose}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Equipment & Utensils */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3">
                       <ChefHat className="w-5 h-5 text-brand-gold" />
                       <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Culinary Equipment & Specialized Vessels</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {plan.masterLogistics.equipment.map((item, i) => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-brand-gold/30 transition-all">
                          <div>
                            <div className="text-brand-cream font-bold">{item.utensil}</div>
                            <div className="text-[10px] text-white/30 italic mt-1">{item.useCase}</div>
                          </div>
                          <div className="text-2xl font-serif text-brand-gold font-bold">x{item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Infrastructure */}
                  <div className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Labor & Infrastructure</h3>
                    <div className="space-y-4">
                       <div className="p-8 bg-brand-gold text-brand-bg rounded-[2rem] space-y-6">
                          <div className="flex justify-between items-center border-b border-brand-bg/20 pb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Cooking Stoves</span>
                            <span className="text-2xl font-serif font-black">{plan.masterLogistics.infrastructure.stovesNeeded}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-brand-bg/20 pb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Kitchen Staff</span>
                            <span className="text-2xl font-serif font-black">{plan.masterLogistics.infrastructure.kitchenStaff}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Serving Staff</span>
                            <span className="text-2xl font-serif font-black">{plan.masterLogistics.infrastructure.servingStaff}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Thaal Cutlery & Service Elements */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-brand-gold" />
                    <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Thaal Cutlery & Service Elements</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plan.masterLogistics.thaalCutlery.map((item, i) => (
                      <div key={i} className="p-8 glass-card border-brand-gold/20 rounded-2xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Sparkles className="w-12 h-12 text-brand-gold" />
                        </div>
                        <div className="text-xs uppercase font-black text-brand-gold tracking-widest">{item.item}</div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] text-white/30">
                              <span>Per Thaal</span>
                              <span>x{item.quantityPerThaal}</span>
                           </div>
                           <div className="flex justify-between text-[10px] text-white/30">
                              <span>Buffer/Wastage</span>
                              <span className="text-red-400">+{item.wastageBuffer}</span>
                           </div>
                           <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                              <span className="text-[10px] uppercase font-bold text-white/50">Total Needed</span>
                              <span className="text-2xl font-serif text-brand-cream font-bold">{item.totalNeeded}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-brand-gold/5 border border-brand-gold/20 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 italic text-brand-cream/60">
                   <AlertTriangle className="w-12 h-12 text-brand-gold shrink-0" />
                   <p className="text-sm leading-relaxed">
                     "Quantities generated are calculated based on the standard Bohra Thaal serving of 8 people. The emergency buffers are critical to accommodate for 'The Guest's Grace' (unexpected extra demand or small culinary deviations). Ensure all items are sanitised and ready 4 hours prior to Safra-Orchestration."
                   </p>
                </div>

                <button 
                  onClick={() => setPlan(null)}
                  className="w-full py-6 border border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold transition-all text-[10px] uppercase font-bold tracking-widest"
                >
                  Reset Orchestration
                </button>
              </div>
            ) : activeTab === 'audits' ? (
              <div className="max-w-7xl mx-auto py-12 space-y-12">
                 {/* Top Level Strategic Audits */}
                 <div className="space-y-12">
                   {plan.masterChefAudit && (
                     <div className="p-10 bg-brand-bg border-4 border-double border-brand-gold rounded-[2.5rem] relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)]">
                        <div className="absolute top-0 right-0 p-8">
                          <ShieldAlert className="w-20 h-20 text-brand-gold opacity-5" />
                        </div>
                        <div className="flex items-center gap-4 mb-10">
                          <div className="w-12 h-px bg-brand-gold" />
                          <h4 className="text-xs uppercase tracking-[0.3em] font-black text-brand-gold whitespace-nowrap">
                            The Master Chef's Audit: 40-Year Command Report
                          </h4>
                          <div className="flex-1 h-px bg-brand-gold/20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                            <div className="space-y-3">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold/60">Brutal Assessment</span>
                              <p className="text-lg font-serif italic text-brand-cream leading-relaxed font-medium">
                                "{plan.masterChefAudit.brutalTake}"
                              </p>
                            </div>
                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block mb-3">The Isolation Trap (Greatest Weakness)</span>
                              <p className="text-sm text-red-100/70 leading-relaxed font-light italic">
                                {plan.masterChefAudit.greatestWeakness}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-brand-gold" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Strategic Enhancement</span>
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed pl-7 border-l border-brand-gold/20">
                                {plan.masterChefAudit.strategicEnhancement}
                              </p>
                            </div>
                            <div className="p-8 bg-brand-gold text-brand-bg rounded-2xl shadow-xl">
                              <div className="flex items-center gap-3 mb-4">
                                <Rocket className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Master's Contrarian Command</span>
                              </div>
                              <p className="text-base font-bold leading-relaxed">
                                {plan.masterChefAudit.contrarianTake}
                              </p>
                            </div>
                          </div>
                        </div>
                     </div>
                   )}

                   {plan.safetyAudit && (
                     <div className="p-10 bg-black border-2 border-red-600/40 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.1)]">
                        <div className="absolute -top-12 -right-12 p-12 opacity-5">
                          <ShieldAlert className="w-64 h-64 text-red-600" />
                        </div>
                        <div className="flex items-center justify-between mb-10">
                          <h4 className="text-[11px] uppercase tracking-mega font-bold text-red-500 flex items-center gap-2">
                             Hazard Command: Safety Officer Audit
                          </h4>
                          <span className="px-3 py-1 bg-red-600 text-white text-[8px] font-black rounded-full uppercase tracking-widest">
                            HACCP Compliant
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-8">
                              <div className="space-y-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Critical Control Points (CCPs)</span>
                                <div className="space-y-3">
                                  {plan.safetyAudit.foodSafetyCCPs.map((ccp, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl group hover:bg-red-500/10 transition-colors">
                                      <Activity className="w-4 h-4 text-red-500 mt-1" />
                                      <p className="text-sm text-red-100/80 leading-relaxed font-light">{ccp}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                 <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block mb-3">Ritual Safety Protocol</span>
                                 <p className="text-xs text-white/60 leading-relaxed italic">
                                   {plan.safetyAudit.ritualSafetyProtocol}
                                 </p>
                              </div>
                           </div>
                           <div className="space-y-8">
                              <div className="space-y-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Physical Hazards (Sini/BOH)</span>
                                <div className="space-y-3">
                                  {plan.safetyAudit.physicalHazards.map((hazard, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                      <AlertTriangle className="w-4 h-4 text-red-500" />
                                      <p className="text-sm text-red-100/80">{hazard}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-8 bg-red-600 text-white rounded-2xl shadow-xl">
                                 <div className="flex items-center gap-3 mb-4">
                                   <Zap className="w-4 h-4" />
                                   <span className="text-[10px] uppercase font-bold tracking-widest font-black">Emergency Failover Protocol</span>
                                 </div>
                                 <p className="text-base font-bold leading-tight">
                                   {plan.safetyAudit.emergencyFailover}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                 </div>

                 {/* Secondary Grid Audits */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plan.qaAudit && (
                      <div className="p-8 glass-card border-brand-gold/20 rounded-2xl relative overflow-hidden shadow-2xl bg-brand-bg/50">
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="text-[11px] uppercase tracking-mega font-bold text-brand-gold flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Quality Control Dashboard
                          </h4>
                          <Trophy className="w-5 h-5 text-brand-gold/30" />
                        </div>
                        <div className="space-y-6">
                          {plan.qaAudit.scorecard.map((score, i) => (
                            <div key={i} className="space-y-3">
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">{score.metric}</span>
                                <span className={`text-xl font-mono font-bold ${score.score > 80 ? 'text-green-500' : 'text-brand-gold'}`}>{score.score}%</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score.score}%` }}
                                  className={`h-full ${score.score > 80 ? 'bg-green-500' : 'bg-brand-gold'}`}
                                />
                              </div>
                              <p className="text-[10px] text-white/40 italic leading-relaxed">{score.critique}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.securityAudit && (
                      <div className={`p-8 rounded-2xl relative overflow-hidden border shadow-2xl transition-all duration-500 ${
                        plan.securityAudit.authenticityFirewall.status === 'VERIFIED' 
                          ? 'bg-blue-500/5 border-blue-500/20 text-blue-100' 
                          : 'bg-red-500/5 border-red-500/20 text-red-100'
                      }`}>
                         <div className="flex items-center justify-between mb-8">
                           <h4 className="text-[11px] uppercase tracking-mega font-bold flex items-center gap-2">
                             <Lock className="w-4 h-4" /> Tradition Firewall
                           </h4>
                           <span className={`text-[9px] font-bold px-2 py-1 rounded ${
                             plan.securityAudit.authenticityFirewall.status === 'VERIFIED' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                           }`}>
                             {plan.securityAudit.authenticityFirewall.status}
                           </span>
                         </div>
                         <div className="space-y-6">
                           <div className="space-y-2">
                             <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Tradition Integrity</span>
                             <p className="text-xs leading-relaxed italic">{plan.securityAudit.traditionIntegrity}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Deployment Security</span>
                              <p className="text-xs leading-relaxed">{plan.securityAudit.physicalSecurity}</p>
                           </div>
                         </div>
                      </div>
                    )}

                    {plan.logisticalAudit && (
                      <div className="p-8 border-2 border-brand-gold bg-black rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                              <h4 className="text-xs uppercase tracking-mega font-bold text-brand-gold">Logistical Friction Report</h4>
                            </div>
                            <span className={`px-2 py-1 rounded text-[8px] font-bold ${
                              plan.logisticalAudit.bohIntegrity === 'SOLID' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                            }`}>BOH: {plan.logisticalAudit.bohIntegrity}</span>
                         </div>
                         <div className="space-y-6">
                            <div className="space-y-3">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">Friction Points</span>
                              {plan.logisticalAudit.frictionPoints.map((point, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] text-white/70">
                                  <ShieldAlert className="w-3 h-3 text-brand-gold" /> {point}
                                </div>
                              ))}
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${plan.logisticalAudit.chaosFactor}%` }} className="h-full bg-brand-gold" />
                            </div>
                         </div>
                      </div>
                    )}

                    {plan.masterChefAudit && (
                      <div className="p-8 border-2 border-red-900 bg-black rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(153,27,27,0.1)] col-span-full">
                         <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center">
                               <ChefHat className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                               <h4 className="text-xs uppercase tracking-mega font-bold text-red-500">Master Chef's Audit</h4>
                               <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest italic">40-Year Culinary Tenure Assessment</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Brutal Take</span>
                                  <p className="text-sm font-serif italic text-red-100/80 leading-relaxed border-l-2 border-red-900/50 pl-6">"{plan.masterChefAudit.brutalTake}"</p>
                               </div>
                               <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">Greatest Weakness</span>
                                  <p className="text-xs text-white/60 leading-relaxed italic">{plan.masterChefAudit.greatestWeakness}</p>
                               </div>
                            </div>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">Strategic Enhancement</span>
                                  <p className="text-xs text-white/60 leading-relaxed">{plan.masterChefAudit.strategicEnhancement}</p>
                               </div>
                               <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">The Contrarian Logic</span>
                                  <p className="text-xs text-white/60 leading-relaxed font-mono italic">"{plan.masterChefAudit.contrarianTake}"</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {plan.strategicAudit && (
                      <div className="p-8 glass-card bg-brand-gold/5 border-brand-gold/30 rounded-2xl relative overflow-hidden">
                         <div className="flex items-center justify-between mb-8">
                           <h4 className="text-[11px] uppercase tracking-mega font-bold text-brand-gold">Strategic Command</h4>
                           <span className="text-[9px] font-bold px-2 py-1 bg-brand-gold text-brand-bg rounded-full uppercase">{plan.strategicAudit.marketReadiness}</span>
                         </div>
                         <div className="space-y-4">
                           <p className="text-sm font-serif italic text-brand-cream/80 border-l-2 border-brand-gold/40 pl-6">
                             "{plan.strategicAudit.theLeaver}"
                           </p>
                           <p className="text-[11px] text-white/70">{plan.strategicAudit.strategicMoat}</p>
                         </div>
                      </div>
                    )}

                    {plan.documentationAudit && (
                      <div className="p-8 bg-stone-900 border border-stone-800 rounded-3xl relative overflow-hidden shadow-2xl col-span-full">
                         <div className="flex items-center gap-2 mb-8">
                           <FileText className="w-4 h-4 text-brand-gold" />
                           <h4 className="text-xs uppercase tracking-mega font-bold text-brand-gold">Heritage Codex: SOP</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold/60">Host SOP</span>
                             <p className="text-sm text-stone-300 leading-relaxed font-serif italic">"{plan.documentationAudit.hostSop}"</p>
                           </div>
                           <div className="space-y-4">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold/60">Server SOP</span>
                             <p className="text-sm text-stone-300 leading-relaxed">{plan.documentationAudit.serverSop}</p>
                           </div>
                         </div>
                      </div>
                    )}

                    {plan.engineeringAudit && (
                      <div className={`p-8 rounded-2xl border shadow-2xl ${kitchenMode ? 'bg-zinc-900 border-white/10' : 'bg-brand-gold/10 border-brand-gold/20'}`}>
                         <h4 className="text-[11px] uppercase tracking-mega font-bold mb-6 flex items-center gap-2">
                           <Settings className="w-4 h-4" /> Engineering & Logistics
                         </h4>
                         <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-black/40 rounded">
                                <span className="text-[8px] uppercase font-bold opacity-50 block mb-1">Critical Path</span>
                                <span className="text-xs font-bold">{plan.engineeringAudit.criticalPath}</span>
                              </div>
                              <div className="p-4 bg-black/40 rounded">
                                <span className="text-[8px] uppercase font-bold opacity-50 block mb-1">Bottleneck</span>
                                <span className="text-xs font-bold">{plan.engineeringAudit.bottleneckDish}</span>
                              </div>
                           </div>
                           <p className="text-xs text-white/60">{plan.engineeringAudit.scaleAdjustments}</p>
                         </div>
                      </div>
                    )}

                    <div className="p-8 bg-brand-gold text-brand-bg rounded-2xl relative overflow-hidden shadow-2xl">
                       <ChefHat className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                       <h4 className="text-[11px] uppercase tracking-mega font-bold mb-6 opacity-80">Orchestrator Wisdom</h4>
                       <p className="font-bold leading-relaxed text-sm mb-6 italic">
                         "This Thaal sequence is a masterclass in palate dynamics."
                       </p>
                       <div className="pt-6 border-t border-brand-bg/20 flex justify-between items-center">
                         <span className="text-[10px] uppercase font-bold opacity-70">Thaal Count</span>
                         <span className="text-sm font-bold">{plan.guestCount / 8} Thaals</span>
                       </div>
                    </div>

                    {plan.atmosphere && (
                      <div className="p-8 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-2xl relative overflow-hidden shadow-2xl">
                         <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" />
                         <h4 className="text-[11px] uppercase tracking-mega font-bold mb-8 opacity-80">Atmosphere Orchestration</h4>
                         <div className="space-y-6">
                           <div className="flex justify-between border-b border-brand-gold/20 pb-4">
                             <span className="text-[10px] uppercase font-bold opacity-70">Lighting</span>
                             <span className="text-sm font-bold text-right">{plan.atmosphere.lighting}</span>
                           </div>
                           <div className="flex justify-between border-b border-brand-gold/20 pb-4">
                             <span className="text-[10px] uppercase font-bold opacity-70">Signature Scent</span>
                             <span className="text-sm font-bold text-right">{plan.atmosphere.scent}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-[10px] uppercase font-bold opacity-70">Hospitality Vibe</span>
                             <span className="text-sm font-bold text-right">{plan.atmosphere.vibe}</span>
                           </div>
                         </div>
                      </div>
                    )}

                    {plan.complementarySuggestions && (
                      <div className="p-8 bg-brand-gold text-brand-bg rounded-2xl relative overflow-hidden shadow-2xl">
                         <Wand2 className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                         <h4 className="text-[11px] uppercase tracking-mega font-bold mb-8 opacity-80">Flavor Harmony</h4>
                         <div className="space-y-6">
                           {plan.complementarySuggestions.map((suggestion, i) => (
                             <div key={i} className="space-y-2 border-b border-brand-bg/20 pb-4 last:border-0 shadow-sm last:pb-0">
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{suggestion.dishType}</span>
                                 <span className="text-[9px] px-2 py-0.5 bg-brand-bg text-brand-gold rounded font-bold uppercase">{suggestion.suggestedFlavor}</span>
                               </div>
                               <p className="text-xs font-bold leading-relaxed">{suggestion.reason}</p>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                 </div>

                 <button 
                   onClick={() => setPlan(null)}
                   className="w-full py-6 border border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold transition-all text-[10px] uppercase font-bold tracking-widest"
                 >
                   Reset Orchestration
                 </button>
              </div>
            ) : activeTab === 'combinations' ? (
              <div className="max-w-7xl mx-auto py-12 space-y-12">
                 {/* Selection Logic & Sensory Profile */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 p-12 bg-white/[0.01] border border-brand-gold/20 rounded-[3rem] relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-8">
                          <Sparkles className="w-24 h-24 text-brand-gold opacity-5" />
                        </div>
                        <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-6">Selection Philosophy</h3>
                        <h2 className="text-4xl font-serif text-brand-cream mb-8 font-medium">Why This <span className="italic text-brand-gold">Specific Symphony</span>?</h2>
                        <p className="text-lg text-white/60 font-light leading-relaxed italic">
                          "{plan.combinationsAudit.selectionLogic}"
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Zap className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Taste Symphony</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.tasteSymphony}"</p>
                       </div>
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Target className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Texture Mapping</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.textureMapping}"</p>
                       </div>
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Library className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Palate Modulation</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.palateModulation}"</p>
                       </div>
                    </div>
                 </div>

                 {/* Flavor Progression Section */}
                 <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Palate Orchestration</h3>
                          <h2 className="text-2xl font-serif text-brand-cream">Course-by-Course Flavor Progression</h2>
                       </div>
                    </div>

                     <p className="text-xs text-white/40 leading-relaxed italic max-w-3xl border-l border-brand-gold/20 pl-6 py-2">
                        The Bohra Thaal is a deliberate sensory journey. This audit tracks how each flavor note prepares the palate for the next, ensuring a harmonious and balanced experience that heights with every course, guiding the palate from initial sweetness through savory complexity to a final grand conclusion.
                     </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {plan.combinationsAudit.flavorProgression.map((stage, i) => (
                          <div key={i} className="p-10 glass-card border-brand-gold/10 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-gold/30 transition-all">
                             <div className="absolute -top-4 -right-4 text-6xl font-serif text-brand-gold opacity-5 group-hover:opacity-10 transition-opacity">0{i + 1}</div>
                             <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                   <span className="text-[9px] uppercase font-bold text-brand-gold tracking-widest block opacity-50">Course</span>
                                   <h4 className="text-xl font-serif text-brand-cream">{stage.course}</h4>
                                </div>
                                <div className="space-y-3">
                                   <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                      <span className="text-[8px] uppercase font-bold text-white/30 tracking-widest block mb-1">Transition</span>
                                      <p className="text-[11px] text-white/50 leading-relaxed italic">"{stage.transition}"</p>
                                   </div>
                                   <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl">
                                      <span className="text-[8px] uppercase font-bold text-brand-gold/50 tracking-widest block mb-1">Palate Effect</span>
                                      <p className="text-[11px] text-brand-cream/70 leading-relaxed font-medium">"{stage.palateEffect}"</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Efficiency Secrets */}
                   <div className="p-10 bg-brand-bg border border-brand-gold/20 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-gold/40 transition-all">
                      <div className="absolute top-0 right-0 p-8">
                        <Zap className="w-16 h-16 text-brand-gold opacity-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                              <Zap className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Operations Strategy</h4>
                              <h3 className="text-2xl font-serif text-brand-cream">Efficiency Secrets</h3>
                           </div>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-brand-gold/30 pl-6">
                           "{plan.combinationsAudit.efficiencySecrets}"
                        </p>
                        <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                           <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-brand-gold" />
                              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Relay Optimization</span>
                           </div>
                           <p className="text-xs text-white/50">{plan.combinationsAudit.efficiencyAnalysis}</p>
                        </div>
                      </div>
                   </div>

                   {/* Cost Levers */}
                   <div className="p-10 bg-brand-bg border border-brand-gold/20 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-gold/40 transition-all">
                      <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="w-16 h-16 text-green-500 opacity-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                              <TrendingUp className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Procurement Logic</h4>
                              <h3 className="text-2xl font-serif text-brand-cream">Cost Levers</h3>
                           </div>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-green-500/30 pl-6">
                           "{plan.combinationsAudit.costLevers}"
                        </p>
                        <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                           <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-green-500" />
                              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Waste Management</span>
                           </div>
                           <p className="text-xs text-white/50">{plan.combinationsAudit.costOptimization}</p>
                        </div>
                      </div>
                   </div>
                </div>

                 {/* Substitution Intelligence Section */}
                 <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                       <div>
                          <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Intelligence Audit</h3>
                          <h2 className="text-2xl font-serif text-brand-cream">The Master's Substitution Codex</h2>
                       </div>
                       <p className="text-xs text-white/40 italic max-w-xl text-right">
                          In the Daawat, flexibility must never compromise authenticity. These sanctioned swaps ensure the "Rooh" (Soul) of the dish remains intact while adapting to modern availability or logistical constraints.
                       </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Allowed Substitutions */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                         </div>
                         <h4 className="text-[11px] uppercase tracking-mega font-bold text-white/80">Expert-Sanctioned Substitutions</h4>
                       </div>
                       <div className="space-y-4">
                         {plan.combinationsAudit.allowedSubstitutions.map((sub, i) => (
                           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-brand-gold/30 transition-all relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                 <CheckCircle2 className="w-12 h-12 text-brand-gold" />
                              </div>
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-serif text-white/40 line-through tracking-wider">{sub.original}</span>
                                <ArrowRight className="w-3 h-3 text-brand-gold" />
                                <span className="text-base font-serif text-brand-gold font-bold">{sub.substitute}</span>
                              </div>
                              <p className="text-[11px] text-white/50 leading-relaxed italic border-l border-brand-gold/30 pl-4">{sub.reason}</p>
                           </div>
                         ))}
                       </div>
                    </div>

                    {/* Forbidden Substitutions */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                         </div>
                         <h4 className="text-[11px] uppercase tracking-mega font-bold text-white/80">The Master's Veto: Forbidden</h4>
                       </div>
                       <div className="space-y-4">
                         {plan.combinationsAudit.forbiddenSubstitutions.map((sub, i) => (
                           <div key={i} className="p-8 bg-black border border-red-500/30 rounded-2xl group relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                 <AlertTriangle className="w-12 h-12 text-red-900" />
                              </div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase font-bold text-white/30 block tracking-widest">{sub.dish}</span>
                                  <span className="text-base font-serif text-red-100 font-medium">DO NOT replace with <span className="text-red-500 font-bold">{sub.forbidden}</span></span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5" />
                                <p className="text-[11px] text-red-100/60 leading-relaxed italic">
                                  <span className="text-red-400 font-bold uppercase text-[9px] mr-2">Consequence:</span>
                                  {sub.consequence}
                                </p>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>

                 </div>

               <div className="p-10 bg-brand-gold text-brand-bg rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                       <ChefHat className="w-64 h-64" />
                    </div>
                    <div className="w-20 h-20 rounded-full border border-brand-bg/20 flex items-center justify-center shrink-0">
                       <ChefHat className="w-10 h-10" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-lg font-bold mb-2">Host's Strategic Brief</h4>
                      <p className="text-sm border-l border-brand-bg/40 pl-6 opacity-90 leading-relaxed font-medium max-w-3xl">
                        "The brilliance of this combination lies in its non-linear progression. We aren't just moving through courses; we are modulating the guest's sensory load. As host, guard the sequence—it is the secret to a Thaal that feels light despite its opulence."
                      </p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setPlan(null)}
                   className="w-full py-6 border border-white/10 text-white/30 hover:text-brand-gold hover:border-brand-gold transition-all text-[10px] uppercase font-bold tracking-widest"
                 >
                   Reset Orchestration
                 </button>
              </div>
            ) : activeTab === 'timeline' ? (
              <div className="max-w-7xl mx-auto py-12">
                <div className="space-y-24">
                  {/* Parallel Track Headers */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 sticky top-0 bg-brand-bg z-10 py-6 border-b border-white/5 transition-colors ${kitchenMode ? 'bg-black border-red-500/20' : ''}`}>
                    {['Active Cooking', 'Host Rituals', 'Prep/Plating'].map(track => (
                      <div key={track} className="hidden md:block">
                        <span className={`text-[10px] uppercase font-bold tracking-mega ${kitchenMode ? 'text-red-500' : 'text-brand-gold'}`}>
                          {track}
                        </span>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const grouped = plan.timeline.reduce((acc: any[], step) => {
                      const last = acc[acc.length - 1];
                      if (last && last.time === step.timeRelative) {
                        last.steps.push(step);
                      } else {
                        acc.push({ time: step.timeRelative, steps: [step] });
                      }
                      return acc;
                    }, []);

                    return grouped.map((timeGroup, i) => {
                      const hasHostRitual = timeGroup.steps.some((s: any) => s.track === 'Host Rituals');
                      const hasChefAction = timeGroup.steps.some((s: any) => s.track === 'Active Cooking' || s.track === 'Prep/Plating');
                      const isSynced = hasHostRitual && hasChefAction;
                      const isolationRisk = !isSynced && timeGroup.steps.length > 0;

                      return (
                        <div key={i} className="group relative">
                          <div className={`absolute left-0 right-0 h-px top-0 ${kitchenMode ? 'bg-red-500/20' : 'bg-white/5'}`} />
                          
                          {/* Sync Connector Line */}
                          {isSynced && (
                            <div className="absolute left-1/2 -ml-0.5 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold/40 via-brand-gold/10 to-transparent hidden md:block" />
                          )}

                          <div className="py-16">
                            <div className="flex items-center gap-6 mb-12">
                              <div className={`text-3xl font-mono font-black tracking-tighter ${kitchenMode ? 'text-red-500' : 'text-brand-gold'}`}>
                                {timeGroup.time}
                              </div>
                              {isSynced && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full">
                                  <Activity className="w-3 h-3 text-brand-gold animate-pulse" />
                                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Active Sync Moment</span>
                                </div>
                              )}
                              {isolationRisk && plan.releaseAudit.ritualLatency === 'High' && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                                  <AlertTriangle className="w-3 h-3 text-red-500" />
                                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Isolation Trap Risk</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                              {['Active Cooking', 'Host Rituals', 'Prep/Plating'].map(trackName => {
                                const step = timeGroup.steps.find((s: any) => s.track === trackName);
                                return (
                                  <div key={trackName} className={`relative min-h-[140px] flex flex-col ${!step ? 'opacity-10 hidden md:block' : ''}`}>
                                    {step && (
                                      <motion.div 
                                        initial={{ opacity: 0, x: trackName === 'Active Cooking' ? -20 : (trackName === 'Prep/Plating' ? 20 : 0) }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className={`flex-1 p-8 rounded-2xl border transition-all duration-700 relative overflow-hidden ${
                                          kitchenMode 
                                            ? 'bg-neutral-950 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)]' 
                                            : 'glass-card bg-white/[0.01] border-brand-gold/10 hover:border-brand-gold/30'
                                        }`}
                                      >
                                        {/* Status Glow for Active Sync */}
                                        {isSynced && (
                                          <div className="absolute top-0 right-0 p-4">
                                            <div className="w-1 h-1 rounded-full bg-brand-gold animate-ping" />
                                          </div>
                                        )}

                                        <div className="flex items-center justify-between mb-8">
                                          <span className={`text-[10px] uppercase font-bold tracking-widest ${kitchenMode ? 'text-red-400' : 'text-brand-gold'}`}>
                                            {step.stage}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-[8px] uppercase font-bold px-2 py-1 rounded-md ${
                                              step.role === 'Chef' 
                                                ? (kitchenMode ? 'bg-red-500 text-black' : 'bg-brand-gold text-brand-bg') 
                                                : 'bg-white/10 text-white'
                                            }`}>
                                              {step.role}
                                            </span>
                                          </div>
                                        </div>

                                        <p className={`text-2xl font-serif leading-tight mb-8 ${kitchenMode ? 'text-white' : 'text-brand-cream/90'}`}>
                                          {step.action}
                                        </p>
                                        
                                        <div className="space-y-6 mt-auto">
                                          {step.sensoryCue && (
                                            <div className={`pt-6 border-t ${kitchenMode ? 'border-red-500/20' : 'border-white/5'}`}>
                                              <div className="flex items-center gap-2 mb-2 opacity-40">
                                                <Eye className="w-3 h-3" />
                                                <span className="text-[9px] uppercase font-bold tracking-widest">Orchestrator Cue</span>
                                              </div>
                                              <p className={`text-xs italic leading-relaxed ${kitchenMode ? 'text-red-200/40' : 'text-white/30'}`}>
                                                {step.sensoryCue}
                                              </p>
                                            </div>
                                          )}

                                          {step.coordinationNote && (
                                            <div className={`p-4 rounded-xl ${kitchenMode ? 'bg-red-500/5' : 'bg-brand-gold/5'} border ${kitchenMode ? 'border-red-500/10' : 'border-brand-gold/10'}`}>
                                               <div className="flex items-center gap-2 mb-2 opacity-60">
                                                 <Zap className="w-3 h-3 text-brand-gold" />
                                                 <span className="text-[9px] uppercase font-bold tracking-widest">Critical Coordination</span>
                                               </div>
                                               <p className={`text-[11px] leading-relaxed ${kitchenMode ? 'text-red-100/60' : 'text-brand-cream/70'}`}>
                                                 {step.coordinationNote}
                                               </p>
                                            </div>
                                          )}

                                          {step.atmosphericTrigger && (
                                            <div className="flex items-center gap-3 py-2 border-t border-white/5">
                                              <Sparkles className="w-3 h-3 text-brand-gold opacity-50" />
                                              <p className="text-[9px] uppercase font-bold tracking-widest text-white/40 italic">
                                                {step.atmosphericTrigger}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                    <div className="md:hidden text-[9px] uppercase font-bold text-white/20 mt-4 px-4 tracking-widest">{trackName}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
}
