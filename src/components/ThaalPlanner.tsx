import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Clock, ChefHat, Sparkles, Wand2, ArrowRight, Play, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Settings, ShieldAlert, Activity, Trophy, AlertTriangle, Lock, Eye, EyeOff, Rocket, Zap, FileText, Library, Globe, Target, TrendingUp, ShieldCheck, Search, ArrowUpDown, ChevronLeft, ChevronRight, Check, RotateCcw, Share2, Loader2, BarChart2 } from 'lucide-react';
import { ThaalPlan, Recipe } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const escapeHtml = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

interface ThaalPlannerProps {
  onClose: () => void;
  onStartKitchenMode: (recipe: Recipe) => void;
  onStageChange?: (stage: number) => void;
  currentStage?: number;
  plan: ThaalPlan | null;
  setPlan: (plan: ThaalPlan | null) => void;
  thaalCount: number;
  setThaalCount: (count: number) => void;
  onSavePlan: (plan: ThaalPlan) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  isArchived?: boolean;
}

export function ThaalPlanner({ 
  onClose, 
  onStartKitchenMode, 
  onStageChange, 
  currentStage = 0,
  plan,
  setPlan,
  thaalCount,
  setThaalCount,
  onSavePlan,
  onSaveRecipe,
  isArchived = false
}: ThaalPlannerProps) {
  const [location, setLocation] = useState('');
  const [month, setMonth] = useState('January');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'audits' | 'combinations' | 'logistics'>('overview');
  const [expandedDishIndex, setExpandedDishIndex] = useState<number | null>(null);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  
  useEffect(() => {
    if (onStageChange && plan) {
      // Map timeline step to a 1-8 course progression roughly, or just 1-6 if 6 courses.
      // Since it's a 25 step timeline, let's just use it as is or map it.
      // For the CEO gauge, let's use the sequence in the timeline if possible.
      onStageChange(Math.floor((currentStep / plan.timeline.length) * 8) + 1);
    }
  }, [currentStep, plan, onStageChange]);

  const [isChallenging, setIsChallenging] = useState<number | null>(null);
  const [challengeResponse, setChallengeResponse] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [menuBalance, setMenuBalance] = useState<string | null>(null);
  const [isBalancing, setIsBalancing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string }), []);

  // Logistics states
  const [ingSearch, setIngSearch] = useState('');
  const [equipSearch, setEquipSearch] = useState('');
  const [cutlerySearch, setCutlerySearch] = useState('');
  const [ingSort, setIngSort] = useState<{ field: string, dir: 'asc' | 'desc' } | null>(null);
  const [equipSort, setEquipSort] = useState<{ field: string, dir: 'asc' | 'desc' } | null>(null);
  const [cutlerySort, setCutlerySort] = useState<{ field: string, dir: 'asc' | 'desc' } | null>(null);

  const analyzeMenuBalance = async () => {
    if (!plan) return;
    setIsBalancing(true);
    setMenuBalance(null);
    const courseList = plan.dishes
      .map(d => `Course ${d.sequence} (${d.type}): ${d.recipe.title} [${d.recipe.flavorProfile}]`)
      .join('\n');
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: `As a Bohra culinary master, analyze this Thaal menu for balance:\n${courseList}\n\nEvaluate flavor progression, texture contrast, temperature variation, and cultural integrity. Suggest up to 2 specific swaps if needed. Max 120 words.` }] }]
      });
      setMenuBalance(response.text || "The Master sees no imbalance — the symphony is perfect.");
    } catch {
      setMenuBalance("The Master's wisdom is unavailable. Try again.");
    } finally {
      setIsBalancing(false);
    }
  };

  const sharePlan = () => {
    if (!plan) return;
    try {
      // URL-safe base64: avoids + and / which can be mishandled in some URL contexts
      const encoded = btoa(encodeURIComponent(JSON.stringify(plan)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      window.location.hash = `plan=${encoded}`;
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    } catch {
      alert('Unable to generate share link.');
    }
  };

  const challengeTheMaster = async (dishIndex: number) => {
    if (!plan) return;
    setIsChallenging(dishIndex);
    const dish = plan.dishes[dishIndex];
    
    const prompt = `As a master Bohra Chef, a user is challenging course #${dish.sequence}: ${dish.recipe.title}. 
    They think there's a ritual or balance issue. 
    Defend the orchestration with a short, authoritative, but informative 100-word response that explains why THIS course is essential at THIS moment for the Barakat of the Thaal. Mention specific Bohra traditions.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      setChallengeResponse(response.text || "The Master nods in silent agreement.");
    } catch (error) {
      setChallengeResponse("The Master remains silent. (Error connecting to the Daawat expert)");
    }
  };

  const printContent = (title: string, content: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print your inventory lists.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(title)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;600;700&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'Inter', sans-serif;
              background: #F5F0E8;
              color: #2C1810;
              padding: 48px;
              max-width: 1000px;
              margin: 0 auto;
              line-height: 1.65;
            }
            h1 {
              font-family: 'Cormorant Garamond', serif;
              color: #2C1810;
              font-size: 38px;
              font-weight: 600;
              border-bottom: 3px solid #DAA520;
              padding-bottom: 16px;
              margin-bottom: 28px;
              text-align: center;
            }
            h2 {
              font-family: 'Cormorant Garamond', serif;
              color: #8B4513;
              font-size: 22px;
              margin-top: 40px;
              border-left: 4px solid #DAA520;
              padding-left: 14px;
              padding-bottom: 4px;
            }
            h3 { font-family: 'Cormorant Garamond', serif; color: #5C3010; margin-top: 24px; font-size: 17px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #DAA52033; padding: 10px 14px; text-align: left; }
            th { background: #EDE5D4; font-weight: 700; color: #8B4513; text-transform: uppercase; font-size: 9px; letter-spacing: 0.15em; }
            td { font-size: 13px; color: #3D2010; }
            .footer { margin-top: 60px; font-size: 9px; color: #A08040; border-top: 1px solid #DAA52040; padding-top: 16px; text-align: center; letter-spacing: 0.1em; text-transform: uppercase; }
            .recipe-block { page-break-inside: avoid; margin-bottom: 40px; border: 1px solid #DAA52033; padding: 24px; border-radius: 4px; background: #FAF6EE; }
            .tag { display: inline-block; padding: 3px 10px; background: #DAA520; color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px; }
            @media print {
              body { background: #F5F0E8; padding: 24px; }
              .footer { position: fixed; bottom: 16px; width: 100%; }
              .recipe-block { border-color: #DAA52044; }
            }
          </style>
        </head>
        <body>
          <div class="tag">DAWOODI BOHRA TRADITION</div>
          <h1>${escapeHtml(title)}</h1>
          <p style="text-align: center; color: #666; margin-bottom: 40px;">
            Orchestration Plan: ${escapeHtml(plan?.title)} | Total Guests: ${plan?.guestCount}
            ${plan?.location ? ` | Location: ${escapeHtml(plan.location)}` : ''}
            ${plan?.month ? ` | Month: ${escapeHtml(plan.month)}` : ''}
          </p>
          ${content}
          <div class="footer">
            Copyright Ali Asger Talib / Noore Sara A Talib<br/>
            Generated by Thaal Traditions Orchestrator
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // window.close(); // Not closing automatically to allow user to see it if print fails
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printAllRecipes = () => {
    if (!plan) return;
    
    let content = '';
    
    // 1. Master Ingredient List
    content += `
      <div class="recipe-block">
        <h2>MASTER PROCUREMENT: INGREDIENTS & SPICES</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Category</th><th>Total Needed</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            ${plan.masterLogistics.ingredients.map(ing => `
              <tr>
                <td>${escapeHtml(ing.item)}</td>
                <td>${escapeHtml(ing.category || 'N/A')}</td>
                <td style="color:#DAA520; font-weight:bold">${escapeHtml(ing.totalProcurement)}</td>
                <td>${escapeHtml(ing.purpose)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // 2. Master Equipment List
    content += `
      <div class="recipe-block">
        <h2>INFRASTRUCTURE: VESSELS & EQUIPMENT</h2>
        <table>
          <thead>
            <tr><th>Utensil</th><th>Quantity</th><th>Use Case</th></tr>
          </thead>
          <tbody>
            ${plan.masterLogistics.equipment.map(eq => `
              <tr>
                <td>${escapeHtml(eq.utensil)}</td>
                <td>${eq.quantity}</td>
                <td>${escapeHtml(eq.useCase)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // 3. Master Cutlery List
    content += `
      <div class="recipe-block">
        <h2>RITUAL ELEMENTS: THAAL CUTLERY & SERVICE</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Total Needed</th><th>Use Case</th></tr>
          </thead>
          <tbody>
            ${plan.masterLogistics.thaalCutlery.map(c => `
              <tr>
                <td>${escapeHtml(c.item)}</td>
                <td>${c.totalNeeded}</td>
                <td>${escapeHtml(c.useCase)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // 4. Individual Course Recipes
    content += `<h1>Individual Course Recipes</h1>`;
    plan.dishes.forEach((dish) => {
      content += `
        <div class="recipe-block">
          <h2>COURSE ${dish.sequence}: ${escapeHtml(dish.recipe.title)} (${escapeHtml(dish.type)})</h2>
          <p><strong>Time:</strong> ${escapeHtml(dish.recipe.time)} | <strong>Heritage:</strong> ${escapeHtml(dish.recipe.heritage)}</p>
          <p><em>${escapeHtml(dish.recipe.description)}</em></p>

          <h3>Ingredients</h3>
          <ul>
            ${dish.recipe.ingredients.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}
          </ul>

          <h3>Instructions</h3>
          <ol>
            ${dish.recipe.instructions.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>

          <div style="margin-top: 20px; padding: 15px; background: #fffcf0; border-left: 4px solid #DAA520; font-size: 0.9em; font-style: italic;">
            <strong>Chef's Intuition:</strong> ${escapeHtml(dish.chefIntuition)}
          </div>
        </div>
      `;
    });

    printContent("The Complete Orchestration Guide", content);
  };

  const printIngredients = () => {
    if (!plan) return;
    const items = plan.masterLogistics.ingredients.map(ing => `
      <tr>
        <td>${escapeHtml(ing.item)}</td>
        <td>${escapeHtml(ing.totalProcurement)}</td>
        <td>${escapeHtml(ing.purpose)}</td>
      </tr>
    `).join('');
    
    const content = `
      <h2>Ingredient & Spice Inventory</h2>
      <table>
        <thead>
          <tr><th>Item</th><th>Total Procurement</th><th>Purpose</th></tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
    `;
    printContent("Inventory: Ingredients & Spices", content);
  };

  const printEquipment = () => {
    if (!plan) return;
    const items = plan.masterLogistics.equipment.map(eq => `
      <tr>
        <td>${escapeHtml(eq.utensil)}</td>
        <td>${eq.quantity}</td>
        <td>${escapeHtml(eq.useCase)}</td>
      </tr>
    `).join('');
    
    const content = `
      <h2>Vessels & Specialized Equipment</h2>
      <table>
        <thead>
          <tr><th>Utensil</th><th>Quantity</th><th>Use Case</th></tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
    `;
    printContent("Inventory: Vessels & Equipment", content);
  };

  const printCutlery = () => {
    if (!plan) return;
    const items = plan.masterLogistics.thaalCutlery.map(c => `
      <tr>
        <td>${escapeHtml(c.item)}</td>
        <td>${c.totalNeeded}</td>
        <td>${escapeHtml(c.useCase)}</td>
      </tr>
    `).join('');
    
    const content = `
      <h2>Thaal Cutlery & Service Elements</h2>
      <table>
        <thead>
          <tr><th>Item</th><th>Total Needed</th><th>Use Case</th></tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
    `;
    printContent("Inventory: Thaal Cutlery & Service", content);
  };
  const printOrchestrationManual = () => {
    if (!plan) return;
    
    let content = `
      <h2>Synchronized Timeline</h2>
      <table>
        <thead>
          <tr><th>Time</th><th>Track</th><th>Action</th><th>Role</th><th>Sensory Cue</th></tr>
        </thead>
        <tbody>
          ${plan.timeline.map(step => `
            <tr>
              <td style="font-weight:bold">${escapeHtml(step.timeRelative)}</td>
              <td>${escapeHtml(step.track)}</td>
              <td>${escapeHtml(step.action)}</td>
              <td>${escapeHtml(step.role)}</td>
              <td><em>${escapeHtml(step.sensoryCue)}</em></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h2>Procurement & Master Inventory</h2>
      <h3>Ingredients & Spices</h3>
      <table>
        <thead>
          <tr><th>Item</th><th>Category</th><th>Total Needed</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          ${plan.masterLogistics.ingredients.map(ing => `
            <tr>
              <td>${escapeHtml(ing.item)}</td>
              <td>${escapeHtml(ing.category || 'N/A')}</td>
              <td style="color:#DAA520; font-weight:bold">${escapeHtml(ing.totalProcurement)}</td>
              <td>${escapeHtml(ing.purpose)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Vessels & Equipment</h3>
      <table>
        <thead>
          <tr><th>Utensil</th><th>Quantity</th><th>Use Case</th></tr>
        </thead>
        <tbody>
          ${plan.masterLogistics.equipment.map(eq => `
            <tr>
              <td>${escapeHtml(eq.utensil)}</td>
              <td>${eq.quantity}</td>
              <td>${escapeHtml(eq.useCase)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Thaal Cutlery</h3>
      <table>
        <thead>
          <tr><th>Item</th><th>Total Needed</th><th>Use Case</th></tr>
        </thead>
        <tbody>
          ${plan.masterLogistics.thaalCutlery.map(c => `
            <tr>
              <td>${escapeHtml(c.item)}</td>
              <td>${c.totalNeeded}</td>
              <td>${escapeHtml(c.useCase)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    printContent("The Master Orchestration Manual", content);
  };

  const generateThaalPlan = async () => {
    console.log("Starting Thaal Plan Generation...");
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is not configured. Please check your settings.");
      }
      
      setIsGenerating(true);
      const totalGuests = thaalCount * 8;
      
      const prompt = `Act as a master Dawoodi Bohra Thaal Orchestrator with 40 years of experience serving the high nobility.
      Create a complete, uncompromising Thaal Plan for ${thaalCount} Thaals (Total Guests: ${totalGuests}).

      EVENT CONTEXT:
      - LOCATION: ${location || 'Global (Traditional)'}
      - MONTH/SEASON: ${month}
      - OCCASION: ${occasion || 'General Dawat'}
      
      A Thaal must strictly follow the traditional sequence: 
      1. First Meethas (Sweet) - Must be rich and welcoming.
      2. First Kharaas (Savory) - Must complement the preceding sweet.
      3. Second Meethas - Refreshing and elegant.
      4. Second Kharaas - Decadent and substantial.
      5. Main Course (Gavri/Jaman) - The heart of the Thaal (Rice/Lisan/Kari/Biryani).
      6. Accompaniments (Salads/Dips/Zubaan-ni-Chatas) - Essential for palate resets.
      
      IMPORTANT SEASONAL & REGIONAL CONSTRAINTS:
      - In ${month} at ${location || 'this location'}, adjust the menu accordingly.
      - If Summer: Prioritize cooling elements (curd, fruits, Aamras if appropriate).
      - If Winter: Prioritize warming spices and rich textures.
      
      Requirements:
      - DISHES: Provide exactly 6 courses following the sequence. Provide high-quality heritage titles. Each dish MUST include a complete 'recipe' object with a full list of 'ingredients' and a detailed set of 'instructions' (RecipeStep[]).
      - TIMELINE: A synchronized 25+ step sequence. Every step MUST belong to one of these three tracks: "Active Cooking", "Host Rituals", or "Prep/Plating". 
      - LOGISTICS: 60+ ingredients grouped by category. Specific tools like Patiya, Deg, Sini, Safra.
      - AUDITS: 
          - QA Audit Scoring: 'score' MUST be between 0-100. 100 is perfection. Do NOT output ridiculously low scores like 9.5% unless there is a catastrophic tradition failure. Aim for realistic, high-standard scores (80-98).
          - Master Chef Audit: Provide a "Brutal Take" that is professional, authoritative, and traditional.
      
      Output format MUST be JSON. Ensure 'track' in timeline is NEVER null or undefined.`;

      console.log(`Requesting orchestration for ${thaalCount} Thaals (${totalGuests} guests)...`);
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              guestCount: { type: Type.NUMBER },
              masterCritique: { type: Type.STRING },
              pairingNotes: { type: Type.STRING },
              chefSecret: { type: Type.STRING },
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
                        type: { type: Type.STRING },
                        severity: { type: Type.STRING },
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
                    properties: { status: { type: Type.STRING }, notes: { type: Type.STRING } },
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
                  ritualLatency: { type: Type.STRING }
                },
                required: ["deploymentReadiness", "failoverProtocol", "scalingPhysics", "ritualLatency"]
              },
              logisticalAudit: {
                type: Type.OBJECT,
                properties: {
                  frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  chaosFactor: { type: Type.NUMBER },
                  bohIntegrity: { type: Type.STRING },
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
                  marketReadiness: { type: Type.STRING },
                  theLeaver: { type: Type.STRING },
                  strategicMoat: { type: Type.STRING }
                },
                required: ["resourceOptimization", "marketReadiness", "theLeaver", "strategicMoat"]
              },
              combinationsAudit: {
                type: Type.OBJECT,
                properties: {
                  selectionLogic: { type: Type.STRING },
                  tasteSymphony: { type: Type.STRING },
                  textureMapping: { type: Type.STRING },
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
                  efficiencySecrets: { type: Type.STRING },
                  efficiencyAnalysis: { type: Type.STRING },
                  costLevers: { type: Type.STRING },
                  costOptimization: { type: Type.STRING },
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
                  }
                },
                required: [
                  "selectionLogic", "tasteSymphony", "textureMapping", "palateModulation", 
                  "flavorProgression", "efficiencySecrets", "efficiencyAnalysis", 
                  "costLevers", "costOptimization", "allowedSubstitutions", "forbiddenSubstitutions"
                ]
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
                        category: { type: Type.STRING },
                        baseQuantity: { type: Type.STRING },
                        scaledQuantity: { type: Type.STRING },
                        emergencyBuffer: { type: Type.STRING },
                        totalProcurement: { type: Type.STRING },
                        purpose: { type: Type.STRING }
                      },
                      required: ["item", "category", "baseQuantity", "scaledQuantity", "emergencyBuffer", "totalProcurement", "purpose"]
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
                        wastageBuffer: { type: Type.NUMBER },
                        useCase: { type: Type.STRING }
                      },
                      required: ["item", "quantityPerThaal", "totalNeeded", "wastageBuffer", "useCase"]
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
                      properties: { term: { type: Type.STRING }, meaning: { type: Type.STRING } },
                      required: ["term", "meaning"]
                    }
                  }
                },
                required: ["hostSop", "serverSop", "guestProtocolBrief", "glossary"]
              },
              condiments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    description: { type: Type.STRING },
                    palateOrchestration: { type: Type.STRING }
                  },
                  required: ["name", "type", "description", "palateOrchestration"]
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
                      properties: { location: { type: Type.STRING }, temp: { type: Type.STRING }, vesselMaterial: { type: Type.STRING } },
                      required: ["location", "temp", "vesselMaterial"]
                    },
                    chefIntuition: { type: Type.STRING },
                    mastersFix: { type: Type.STRING },
                        recipe: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            category: { type: Type.STRING, enum: ["Meethas", "Kharaas", "Jamaan", "Salad"] },
                            description: { type: Type.STRING },
                            image: { type: Type.STRING },
                            time: { type: Type.STRING },
                            servings: { type: Type.STRING },
                            servingCount: { type: Type.NUMBER },
                            flavorProfile: { type: Type.STRING, enum: ["Khatta-Mitth", "Zaikedaar", "Kurkura", "Masaledaar", "Malai", "Dhungaar", "Kharaas"] },
                            cuisineType: { type: Type.STRING, enum: ["Traditional", "Fusion"] },
                            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Advanced"] },
                            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            heritage: { type: Type.STRING }
                          },
                          required: ["id", "title", "category", "description", "time", "servings", "servingCount", "flavorProfile", "cuisineType", "difficulty", "ingredients", "instructions", "heritage", "image"]
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
                    track: { 
              type: Type.STRING, 
              description: "Must be exactly one of: 'Active Cooking', 'Host Rituals', 'Prep/Plating'" 
            },
                    timeRelative: { type: Type.STRING },
                    action: { type: Type.STRING },
                    sensoryCue: { type: Type.STRING },
                    coordinationNote: { type: Type.STRING },
                    atmosphericTrigger: { type: Type.STRING },
                    dishId: { type: Type.STRING },
                    role: { type: Type.STRING }
                  },
                  required: ["stage", "track", "timeRelative", "action", "role", "sensoryCue", "coordinationNote", "atmosphericTrigger", "dishId"]
                }
              },
              etiquette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { ritual: { type: Type.STRING }, instruction: { type: Type.STRING } },
                  required: ["ritual", "instruction"]
                }
              },
              atmosphere: {
                type: Type.OBJECT,
                properties: { lighting: { type: Type.STRING }, scent: { type: Type.STRING }, vibe: { type: Type.STRING } },
                required: ["lighting", "scent", "vibe"]
              },
              complementarySuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { dishType: { type: Type.STRING }, suggestedFlavor: { type: Type.STRING }, reason: { type: Type.STRING } },
                  required: ["dishType", "suggestedFlavor", "reason"]
                }
              }
            },
            required: ["title", "guestCount", "masterCritique", "pairingNotes", "chefSecret", "engineeringAudit", "qaAudit", "securityAudit", "releaseAudit", "logisticalAudit", "masterChefAudit", "safetyAudit", "strategicAudit", "combinationsAudit", "masterLogistics", "documentationAudit", "condiments", "dishes", "timeline", "etiquette", "atmosphere", "complementarySuggestions"]
          }
        }
      });

      console.log("AI Response received, parsing...");
      let text = response.text || "";
      if (!text) {
        throw new Error("No response from the digital Daawat experts.");
      }
      
      // Sanitise JSON response
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedPlan = JSON.parse(jsonStr);
      parsedPlan.id = crypto.randomUUID();
      parsedPlan.location = location;
      parsedPlan.month = month;

      // 2.5: Always enforce cultural sequence — Meethas → Kharaas → Jamaan → Salad/Side
      if (Array.isArray(parsedPlan.dishes)) {
        const PRIORITY: Record<string, number> = { 'Meethas': 0, 'Kharaas': 1, 'Jamaan': 2, 'Salad/Side': 3 };
        parsedPlan.dishes.sort((a: any, b: any) => {
          const pa = PRIORITY[a.type] ?? 99;
          const pb = PRIORITY[b.type] ?? 99;
          return pa !== pb ? pa - pb : a.sequence - b.sequence;
        });
        parsedPlan.dishes.forEach((dish: any, i: number) => { dish.sequence = i + 1; });
      }

      // 2.6: Cross-check forbidden substitutions against dish ingredients
      const forbidden = parsedPlan.combinationsAudit?.forbiddenSubstitutions ?? [];
      if (forbidden.length > 0 && Array.isArray(parsedPlan.dishes)) {
        const violations: string[] = [];
        for (const rule of forbidden) {
          const match = parsedPlan.dishes.find((d: any) =>
            d.recipe?.title?.toLowerCase().includes(rule.dish?.toLowerCase() ?? '')
          );
          if (match) {
            const hasViolation = match.recipe.ingredients?.some((ing: string) =>
              ing.toLowerCase().includes(rule.forbidden?.toLowerCase() ?? '')
            );
            if (hasViolation) {
              violations.push(`${match.recipe.title}: forbidden ingredient "${rule.forbidden}"`);
            }
          }
        }
        if (violations.length > 0) {
          console.warn('[Thaal] Forbidden substitution violations:', violations);
          parsedPlan.masterCritique = `⚠️ Tradition Alert: ${violations.join('; ')}\n\n` + (parsedPlan.masterCritique ?? '');
        }
      }

      setPlan(parsedPlan);
      setCompletedSteps([]);
      setCurrentStep(0);
      setActiveTab('overview');
    } catch (error) {
      console.error("Detailed Error in generateThaalPlan:", error);
      const errorMessage = error instanceof Error ? error.message : "Synchronization failed.";
      alert("Orchestration Error: " + errorMessage);
    } finally {
      setIsGenerating(false);
      console.log("Generation process finished.");
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
        {plan && kitchenMode ? (
          <div className="fixed inset-0 bg-black z-[400] flex flex-col font-sans overflow-hidden">
            {/* High Contrast Kitchen Interface */}
            <header className="p-10 border-b-8 border-green-600 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-12">
                <button 
                  onClick={() => setKitchenMode(false)}
                  className="w-24 h-24 bg-green-600 text-black flex items-center justify-center rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(22,163,74,0.3)]"
                >
                  <X className="w-12 h-12" />
                </button>
                <div>
                  <h2 className="text-green-500 uppercase text-xs font-black tracking-mega mb-2">Tactile Command Center</h2>
                  <div className="flex items-center gap-6">
                    <h1 className="text-4xl text-white font-black">ORCHESTRATING {plan.guestCount} GUESTS</h1>
                    <button 
                      onClick={printOrchestrationManual}
                      className="flex items-center gap-3 px-6 py-3 bg-green-900/40 border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-black transition-all rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.1)] group"
                    >
                      <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                      Print Orchestration PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="px-10 py-5 bg-green-900/40 border-2 border-green-500 rounded-3xl text-center">
                  <span className="text-[10px] uppercase font-black text-green-500 block mb-1 font-sans">Ritual Gauge</span>
                  <span className="text-4xl font-black text-white font-mono">{currentStage || 1}/8</span>
                </div>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* Vertical Step-Progressor (High Contrast) */}
              <aside className="w-[450px] bg-zinc-950 border-r-4 border-green-900/50 overflow-y-auto custom-scrollbar p-8 space-y-4">
                 <h4 className="text-[10px] uppercase font-black text-green-500 mb-8 border-b-2 border-green-900/30 pb-4 tracking-widest text-center font-sans">Ritual Workflow</h4>
                 {plan.timeline.map((step, i) => (
                   <button 
                    key={i} 
                    onClick={() => setCurrentStep(i)}
                    className={`w-full text-left p-10 rounded-3xl border-4 transition-all relative ${
                      i === currentStep 
                      ? 'bg-green-600 border-green-400 text-black scale-[1.02] shadow-[0_0_50px_rgba(22,163,74,0.2)]'
                      : completedSteps.includes(i)
                      ? 'bg-green-900/40 border-green-500/50 text-white/60'
                      : 'bg-zinc-900 border-white/5 text-white/30'
                    }`}
                   >
                     {completedSteps.includes(i) && (
                       <div className="absolute top-4 right-4">
                         <CheckCircle2 className={`w-6 h-6 ${i === currentStep ? 'text-black' : 'text-green-500'}`} />
                       </div>
                     )}
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-4xl font-black font-mono">{step.timeRelative}</span>
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded ${i === currentStep ? 'bg-black text-green-600' : 'bg-white/10 text-white/40'}`}>{step.role}</span>
                     </div>
                     <p className={`text-2xl font-bold font-serif leading-tight ${i === currentStep ? 'text-black' : 'text-white/60'}`}>{step.action}</p>
                   </button>
                 ))}
              </aside>

              {/* Central Command Focus */}
              <main className="flex-1 overflow-y-auto p-12 md:p-24 bg-black flex flex-col items-center justify-center text-center">
                 <div className="max-w-5xl space-y-16">
                    <div className="inline-block px-12 py-4 bg-green-500 text-black text-xl font-black rounded-full uppercase tracking-mega mb-12 shadow-[0_0_30px_rgba(34,197,94,0.4)] font-sans">
                       ACTIVE MISSION
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tight text-balance font-serif">
                       {plan.timeline[currentStep]?.action || 'Prepare the Thaal'}
                    </h1>

                    <p className="text-3xl text-green-500 font-bold max-w-4xl opacity-80 leading-relaxed italic font-serif">
                       "{plan.timeline[currentStep]?.coordinationNote || 'Synchronize with the host for optimal palate modulation.'}"
                    </p>                     <div className="pt-24 flex items-center justify-center gap-12">
                       <button 
                         onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                         className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center text-white/40 hover:border-green-500 hover:text-green-500 transition-all font-sans"
                       >
                          <ChevronLeft className="w-16 h-16" />
                       </button>
                       <button 
                         onClick={() => toggleStep(currentStep)}
                         className={`w-48 h-48 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_60px_rgba(22,163,74,0.4)] font-sans ${
                           completedSteps.includes(currentStep) ? 'bg-green-600 text-black' : 'bg-zinc-800 text-green-500 border-4 border-green-500'
                         }`}
                       >
                          <Check className="w-24 h-24" />
                       </button>
                       <button 
                         onClick={() => setCurrentStep(Math.min(plan.timeline.length - 1, currentStep + 1))}
                         className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center text-white/40 hover:border-green-500 hover:text-green-500 transition-all font-sans"
                       >
                          <ChevronRight className="w-16 h-16" />
                       </button>
                    </div>
                 </div>
              </main>
            </div>

           
          </div>
        ) : (
          <div className="flex justify-between items-start mb-16">
            <div className="flex items-start gap-6">
              <button 
                onClick={onClose}
                className="mt-2 p-2 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded-full border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className={`uppercase text-[10px] tracking-mega font-bold mb-4 transition-colors ${
                  kitchenMode ? 'text-red-500' : 'text-brand-gold font-black'
                }`}>Elite Dawat Management</h2>
                <h1 className={`text-6xl font-serif transition-colors ${
                  kitchenMode ? 'text-white font-black' : 'text-brand-cream'
                }`}>Thaal Orchestration</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {plan && (
                <>
                  <button
                    onClick={() => onSavePlan(plan)}
                    className="px-6 py-6 rounded-full border border-brand-gold/30 text-brand-gold text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold/10 transition-all flex items-center gap-2"
                  >
                    <Library className="w-4 h-4" /> {isArchived ? 'Update Archive' : 'Save Thaal'}
                  </button>
                  <button
                    onClick={sharePlan}
                    className="px-6 py-6 rounded-full border border-brand-gold/30 text-brand-gold text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold/10 transition-all flex items-center gap-2"
                    title="Copy shareable link to clipboard"
                  >
                    <Share2 className="w-4 h-4" /> {shareCopied ? 'Link Copied!' : 'Share Plan'}
                  </button>
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="px-6 py-6 rounded-full border border-red-500/30 text-red-400 text-[10px] uppercase font-bold tracking-widest hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Orchestration
                  </button>
                  <button 
                    onClick={() => setKitchenMode(!kitchenMode)}
                    className={`px-12 py-6 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-4 ${
                      kitchenMode 
                        ? 'bg-red-500 text-black border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                        : 'bg-brand-gold text-brand-bg hover:bg-white shadow-2xl'
                    }`}
                  >
                    <Play className={`w-5 h-5 ${kitchenMode ? 'animate-pulse' : ''}`} />
                    {kitchenMode ? 'Kitchen Interface Active' : 'Enter Kitchen Mode'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

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
                For this Dawat, I will calculate the precise sequence of Meethas and Kharaas to ensure your guests experience the pinnacle of Bohra culinary heritage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block text-left">Wedding Location</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Dubai, London..."
                    className="w-full bg-white/[0.03] border border-white/10 py-4 pl-12 pr-6 text-xs text-brand-cream focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-white/20 uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block text-left">Wedding Month</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors" />
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 py-4 pl-12 pr-6 text-xs text-brand-cream focus:outline-none focus:border-brand-gold/50 transition-all appearance-none uppercase tracking-widest"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m} className="bg-brand-bg">{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Occasion selector */}
            <div className="space-y-4 col-span-full">
              <label className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block text-left">Occasion Type</label>
              <div className="flex flex-wrap gap-3">
                {['Eid Milad', 'Walima', 'Muharram', 'Mehfil', 'Casual Daawat'].map(occ => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occasion === occ ? '' : occ)}
                    className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest transition-all rounded-sm border ${
                      occasion === occ
                        ? 'bg-brand-gold text-brand-bg border-brand-gold'
                        : 'border-white/10 text-white/40 hover:border-brand-gold/50 hover:text-brand-gold'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
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
                <div className="flex gap-4 items-center">
                  {plan.location && (
                    <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest">
                      <Globe className="w-3 h-3 text-brand-gold" /> {plan.location}
                    </div>
                  )}
                  {plan.month && (
                    <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest">
                      <Clock className="w-3 h-3 text-brand-gold" /> {plan.month}
                    </div>
                  )}
                </div>
                <p className="text-white/40 max-w-2xl font-light italic">"{plan.pairingNotes}"</p>
              </div>
              
            <div className="flex gap-4">
                <button
                  onClick={analyzeMenuBalance}
                  disabled={isBalancing}
                  className="px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-bg flex items-center gap-2"
                >
                  {isBalancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  Balance Check
                </button>
                <button
                  onClick={printAllRecipes}
                  className="px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-white/5 text-white/60 hover:bg-white hover:text-brand-bg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Print All Recipes
                </button>
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
                <AnimatePresence>
                  {menuBalance && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 bg-brand-gold/5 border border-brand-gold/30 rounded-xl flex gap-4 items-start"
                    >
                      <BarChart2 className="w-5 h-5 text-brand-gold mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[9px] uppercase font-black text-brand-gold tracking-widest mb-2">Master's Balance Assessment</div>
                        <p className="text-sm text-brand-cream/80 leading-relaxed italic">{menuBalance}</p>
                      </div>
                      <button onClick={() => setMenuBalance(null)} className="text-white/20 hover:text-white/60 transition-colors ml-auto shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                           <div className="flex flex-wrap gap-4">
                             <button 
                               onClick={() => onStartKitchenMode(dish.recipe)}
                               className="flex-1 py-4 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-brand-gold hover:bg-brand-gold hover:text-brand-bg transition-all flex items-center justify-center gap-2"
                             >
                               <Play className="w-3 h-3 fill-current" /> Open in Kitchen
                             </button>
                             <button 
                               onClick={() => {
                                 onSaveRecipe(dish.recipe);
                                 alert(`Recipe for ${dish.recipe.title} saved to your archive.`);
                               }}
                               className="flex-1 py-4 border border-brand-gold/20 text-[10px] uppercase font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10 transition-all flex items-center justify-center gap-2"
                             >
                               <Library className="w-3 h-3" /> Save Recipe
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
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                       <div>
                          <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Palate Cleansers</h3>
                          <h2 className="text-3xl font-serif text-brand-cream">Zubaan-ni-Chatas</h2>
                       </div>
                       <p className="text-xs text-white/40 italic max-w-xl text-right">
                          "Taste on the Tongue" — These specialized condiments are the critical balancers of the Bohra Thaal, designed to reset the palate between the Meethas and Kharaas.
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {plan.condiments?.map((item, i) => (
                         <div key={i} className="group p-8 glass-card border-brand-gold/20 bg-brand-bg relative overflow-hidden transition-all duration-500 hover:border-brand-gold/50">
                           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                              <Sparkles className="w-12 h-12 text-brand-gold" />
                           </div>
                           
                           <div className="relative z-10 space-y-6">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                  <div className="text-[10px] font-bold">0{i + 1}</div>
                               </div>
                               <span className="text-[10px] uppercase font-bold text-brand-gold tracking-[0.2em]">{item.type}</span>
                             </div>

                             <div>
                               <div className="text-2xl font-serif text-brand-cream mb-2 group-hover:text-brand-gold transition-colors">{item.name}</div>
                               <p className="text-sm text-white/50 font-light leading-relaxed">{item.description}</p>
                             </div>

                             <div className="pt-6 border-t border-white/5">
                               <div className="flex items-center gap-2 mb-3 text-[9px] uppercase font-bold text-brand-gold/60">
                                 <Activity className="w-3.4 h-3.4 text-brand-gold animate-pulse" /> Palate Orchestration
                               </div>
                               <p className="text-xs text-white/40 italic leading-relaxed bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/10">
                                 {item.palateOrchestration}
                               </p>
                             </div>
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-2">Procurement Directive</h3>
                      <h2 className="text-3xl font-serif text-brand-cream">Exhaustive Ingredient & Spice Inventory</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search ingredients..."
                          value={ingSearch}
                          onChange={(e) => setIngSearch(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/40 transition-all w-full md:w-64"
                        />
                      </div>
                      <button 
                        onClick={printIngredients}
                        className="px-6 py-3 border border-brand-gold/30 text-brand-gold text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-brand-gold hover:text-brand-bg transition-all flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> Print PDF
                      </button>
                    </div>
                  </div>

                  <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-zinc-900 z-10 border-b-8 border-brand-gold">
                          <tr className="text-left">
                            <th className="py-6 px-8 text-[10px] uppercase font-bold text-white/30 tracking-widest cursor-pointer hover:text-brand-gold transition-colors" onClick={() => setIngSort({ field: 'item', dir: ingSort?.field === 'item' && ingSort.dir === 'asc' ? 'desc' : 'asc' })}>
                               <div className="flex items-center gap-2">Item <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center">Base (Unit)</th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center">Scaled</th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center">Buffer</th>
                            <th className="py-6 px-4 text-[10px] uppercase font-bold text-white/30 tracking-widest text-center text-brand-gold cursor-pointer hover:text-white transition-colors" onClick={() => setIngSort({ field: 'totalProcurement', dir: ingSort?.field === 'totalProcurement' && ingSort.dir === 'asc' ? 'desc' : 'asc' })}>
                               <div className="flex items-center justify-center gap-2">Total Procurement <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="py-6 px-8 text-[10px] uppercase font-bold text-white/30 tracking-widest text-right">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(() => {
                            const filtered = (plan.masterLogistics.ingredients || [])
                              .filter(ing => 
                                ing.item.toLowerCase().includes(ingSearch.toLowerCase()) || 
                                ing.purpose.toLowerCase().includes(ingSearch.toLowerCase()) ||
                                (ing.category && ing.category.toLowerCase().includes(ingSearch.toLowerCase()))
                              );
                            
                            const categories = Array.from(new Set(filtered.map(ing => ing.category || 'Other')));
                            
                            return categories.length > 0 ? categories.map(cat => (
                              <React.Fragment key={cat}>
                                <tr className="bg-white/[0.03]">
                                  <td colSpan={6} className="py-4 px-8 border-l-4 border-brand-gold">
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold">{cat}</span>
                                      <span className="text-[10px] text-white/20 font-light lowercase">({filtered.filter(i => (i.category || 'Other') === cat).length} items)</span>
                                    </div>
                                  </td>
                                </tr>
                                {filtered
                                  .filter(ing => (ing.category || 'Other') === cat)
                                  .sort((a, b) => {
                                    if (!ingSort) return 0;
                                    const valA = String((a as any)[ingSort.field] || '');
                                    const valB = String((b as any)[ingSort.field] || '');
                                    return ingSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                                  })
                                  .map((ing, i) => (
                                    <tr key={`${cat}-${i}`} className="hover:bg-white/[0.02] transition-colors group">
                                      <td className="py-6 px-8">
                                        <div className="text-brand-cream font-medium group-hover:text-brand-gold transition-colors">{ing.item}</div>
                                      </td>
                                      <td className="py-6 px-4 text-center text-white/40 font-mono text-xs italic">{ing.baseQuantity}</td>
                                      <td className="py-6 px-4 text-center text-white/60 font-mono text-xs">{ing.scaledQuantity}</td>
                                      <td className="py-6 px-4 text-center text-red-400 font-mono text-[10px]">+{ing.emergencyBuffer}</td>
                                      <td className="py-6 px-4 text-center">
                                        <div className="text-brand-gold font-mono font-bold">{ing.totalProcurement}</div>
                                        <div className="text-[8px] text-white/20 uppercase font-black tracking-tighter">Ready for Dawat</div>
                                      </td>
                                      <td className="py-6 px-8 text-right max-w-xs">
                                        <span className="text-[10px] text-white/40 italic">{ing.purpose}</span>
                                      </td>
                                    </tr>
                                  ))}
                              </React.Fragment>
                            )) : (
                              <tr>
                                <td colSpan={6} className="py-20 text-center text-white/20 italic font-light">
                                  No items found in the master inventory matching your search.
                                </td>
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Equipment & Utensils */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                         <ChefHat className="w-5 h-5 text-brand-gold" />
                         <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Vessels & Specialized Equipment</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Search vessels..."
                            value={equipSearch}
                            onChange={(e) => setEquipSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-[11px] text-brand-cream focus:outline-none focus:border-brand-gold/40 transition-all w-full md:w-56"
                          />
                        </div>
                        <button 
                          onClick={printEquipment}
                          className="p-2 border border-brand-gold/30 text-brand-gold rounded-full hover:bg-brand-gold hover:text-brand-bg transition-all"
                          title="Print Equipment List"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {plan.masterLogistics.equipment
                        .filter(item => item.utensil.toLowerCase().includes(equipSearch.toLowerCase()) || item.useCase.toLowerCase().includes(equipSearch.toLowerCase()))
                        .sort((a,b) => equipSort?.dir === 'asc' ? a.utensil.localeCompare(b.utensil) : (equipSort?.dir === 'desc' ? b.utensil.localeCompare(a.utensil) : 0))
                        .map((item, i) => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-brand-gold/30 transition-all">
                          <div className="flex flex-col gap-1">
                            <div className="text-brand-cream font-bold group-hover:text-brand-gold transition-colors">{item.utensil}</div>
                            <div className="text-[10px] text-white/30 italic flex items-center gap-1">
                              <Target className="w-2.5 h-2.5 text-brand-gold/40" /> {item.useCase}
                            </div>
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
                       <div className="p-8 bg-brand-gold text-brand-bg rounded-[2rem] space-y-6 shadow-2xl">
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
                       <div className="p-6 border border-white/5 rounded-2xl bg-white/[0.02] italic text-[10px] text-white/30 leading-relaxed">
                         Note: Infrastructure requirements are calculated based on concurrent course preparation and synchronized service density.
                       </div>
                    </div>
                  </div>
                </div>

                {/* Thaal Cutlery & Service Elements */}
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold">Thaal Cutlery & Service Elements</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Filter cutlery..."
                          value={cutlerySearch}
                          onChange={(e) => setCutlerySearch(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-[11px] text-brand-cream focus:outline-none focus:border-brand-gold/40 transition-all w-full md:w-56"
                        />
                      </div>
                      <button 
                         onClick={printCutlery}
                         className="p-2 border border-brand-gold/30 text-brand-gold rounded-full hover:bg-brand-gold hover:text-brand-bg transition-all"
                         title="Print Cutlery List"
                       >
                         <FileText className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plan.masterLogistics.thaalCutlery
                      .filter(item => item.item.toLowerCase().includes(cutlerySearch.toLowerCase()) || (item.useCase && item.useCase.toLowerCase().includes(cutlerySearch.toLowerCase())))
                      .map((item, i) => (
                      <div key={i} className="p-8 glass-card border-brand-gold/20 rounded-2xl space-y-6 relative overflow-hidden group hover:border-brand-gold/40 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Sparkles className="w-12 h-12 text-brand-gold" />
                        </div>
                        <div>
                          <div className="text-xs uppercase font-black text-brand-gold tracking-widest mb-1">{item.item}</div>
                          <div className="text-[9px] text-white/30 italic uppercase tracking-tighter">{item.useCase}</div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] text-white/40">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Per Thaal</span>
                              <span>x{item.quantityPerThaal}</span>
                           </div>
                           <div className="flex justify-between text-[10px] text-white/40">
                              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500/50" /> Wastage Buffer</span>
                              <span className="text-red-400/80">+{item.wastageBuffer}</span>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                              <span className="text-[10px] uppercase font-bold text-white/60">Total Needed</span>
                              <span className="text-2xl font-serif text-brand-cream font-bold group-hover:text-brand-gold transition-colors">{item.totalNeeded}</span>
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
                        <p className="text-[10px] text-brand-gold/60 uppercase tracking-widest mb-6 font-bold">
                          Alignment with Heritage Standards
                        </p>
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

                    {plan.releaseAudit && (
                      <div className="p-8 bg-blue-950/40 border border-blue-500/20 rounded-2xl relative overflow-hidden shadow-2xl">
                         <div className="flex items-center justify-between mb-8">
                           <h4 className="text-[11px] uppercase tracking-mega font-bold text-blue-400 flex items-center gap-2">
                             <Rocket className="w-4 h-4" /> Release Readiness
                           </h4>
                           <span className={`text-[9px] font-bold px-2 py-1 rounded ${
                             plan.releaseAudit.ritualLatency === 'Low' ? 'bg-green-500 text-black' :
                             plan.releaseAudit.ritualLatency === 'Moderate' ? 'bg-brand-gold text-brand-bg' :
                             'bg-red-500 text-white'
                           }`}>
                             Ritual Latency: {plan.releaseAudit.ritualLatency}
                           </span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400/60">Deployment Readiness</span>
                             <p className="text-xs text-white/70 leading-relaxed">{plan.releaseAudit.deploymentReadiness}</p>
                           </div>
                           <div className="space-y-2">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400/60">Failover Protocol</span>
                             <p className="text-xs text-white/70 leading-relaxed">{plan.releaseAudit.failoverProtocol}</p>
                           </div>
                           <div className="space-y-2 md:col-span-2">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400/60">Scaling Physics</span>
                             <p className="text-xs text-white/70 leading-relaxed">{plan.releaseAudit.scalingPhysics}</p>
                           </div>
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
              </div>
            ) : activeTab === 'combinations' && plan.combinationsAudit ? (
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
                          "{plan.combinationsAudit.selectionLogic || 'Calculating selection logic...'}"
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Zap className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Taste Symphony</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.tasteSymphony || 'N/A'}"</p>
                       </div>
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Target className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Texture Mapping</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.textureMapping || 'N/A'}"</p>
                       </div>
                       <div className="p-8 glass-card border-brand-gold/20 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-brand-gold">
                             <Library className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-bold tracking-widest">Palate Modulation</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">"{plan.combinationsAudit.palateModulation || 'N/A'}"</p>
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
                       {(plan.combinationsAudit.flavorProgression || []).map((stage, i) => (
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
                           "{plan.combinationsAudit.efficiencySecrets || 'N/A'}"
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
                           "{plan.combinationsAudit.costLevers || 'N/A'}"
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
                         {(plan.combinationsAudit.allowedSubstitutions || []).map((sub, i) => (
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
                         {(plan.combinationsAudit.forbiddenSubstitutions || []).map((sub, i) => (
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
              </div>
            ) : activeTab === 'timeline' ? (
              <div className="max-w-7xl mx-auto py-12">
                {plan.timeline.length === 0 ? (
                  <div className="py-32 text-center space-y-6">
                    <AlertTriangle className="w-12 h-12 text-brand-gold mx-auto opacity-40" />
                    <p className="text-brand-gold font-serif text-2xl italic">The temporal rhythm is currently unaligned.</p>
                    <p className="text-white/40 text-sm max-w-md mx-auto">The orchestrator failed to generate a synchronized timeline. Please reset and try again for a deeper alignment.</p>
                  </div>
                ) : (
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
                      const time = (step.timeRelative && step.timeRelative.trim()) || 'T-Sync';
                      if (last && last.time === time) {
                        last.steps.push(step);
                      } else {
                        acc.push({ time: time, steps: [step] });
                      }
                      return acc;
                    }, []);

                    return grouped.map((timeGroup, i) => {
                      const hasHostRitual = timeGroup.steps.some((s: any) => s.track?.toLowerCase() === 'host rituals');
                      const hasChefAction = timeGroup.steps.some((s: any) => s.track?.toLowerCase() === 'active cooking' || s.track?.toLowerCase() === 'prep/plating');
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
                              <div className="flex flex-col">
                                <span className={`text-[8px] uppercase font-bold tracking-widest mb-1 ${kitchenMode ? 'text-red-500/50' : 'text-brand-gold/50'}`}>Synchronized Timing</span>
                                <div className={`text-3xl font-mono font-black tracking-tighter ${kitchenMode ? 'text-red-500' : 'text-brand-gold'}`}>
                                  {timeGroup.time || 'T-Sync'}
                                </div>
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
                                const step = timeGroup.steps.find((s: any) => s.track?.toLowerCase() === trackName.toLowerCase());
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
              )}
            </div>
          ) : null}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isResetConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-brand-bg border border-white/10 rounded-2xl p-12 max-w-md w-full mx-6 space-y-8"
            >
              <h3 className="font-serif text-2xl text-brand-cream">Reset Orchestration?</h3>
              <p className="text-white/50 text-sm leading-relaxed">Current plan will be permanently wiped. This cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setPlan(null);
                    onStageChange?.(0);
                    setLocation('');
                    setMonth('January');
                    setThaalCount(1);
                    setCompletedSteps([]);
                    setCurrentStep(0);
                    setIsGenerating(false);
                    setKitchenMode(false);
                    setActiveTab('overview');
                    setIsResetConfirmOpen(false);
                  }}
                  className="flex-1 py-4 bg-red-500 text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-red-400 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-4 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
