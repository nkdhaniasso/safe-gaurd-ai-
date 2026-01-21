
import { GoogleGenAI, Type } from "@google/genai";
import { SurveyData, AuditReport, IncidentData, SearchResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecurityReport = async (survey: SurveyData): Promise<AuditReport> => {
  const ai = getAI();
  const prompt = `Perform a deep infrastructure security audit. 
  Vertical: ${survey.industry}, Cloud: ${survey.cloudProviders.join(", ")}, MFA: ${survey.mfaUsage}, Network: ${survey.incidentResponsePlan}.
  Return professional JSON audit report. 
  CRITICAL: Summary must be max 15 words. Findings must be elite-level but concise.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["title", "description", "severity", "recommendation", "category"]
            }
          },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["category", "score"]
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["overallScore", "summary", "findings", "metrics", "roadmap"]
      }
    }
  });

  const data = JSON.parse(response.text.trim());
  return {
    ...data,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
};

export const smartSearchSuggestions = async (query: string): Promise<SearchResult[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a security OS command palette. Based on the search query: "${query}", suggest 2-3 specific security modules or actions in CyberGuard Pro.
    Valid module views: dashboard, survey, audit, incident-report, spam-defense, fraud-suggestions.
    Return JSON array of SearchResult objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING, description: "always 'ai_suggest'" },
            description: { type: Type.STRING },
            view: { type: Type.STRING }
          },
          required: ["id", "title", "type", "description", "view"]
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeSpam = async (content: string): Promise<{ risk: 'CLEAN' | 'SUSPICIOUS' | 'SCAM', advice: string, reasoning: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze risk for content: "${content}". 
    CRITICAL: Advice must be max 10 words. Concise reasoning. JSON output.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING, description: "CLEAN, SUSPICIOUS, or SCAM" },
          advice: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["risk", "advice", "reasoning"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const getFraudSuggestion = async (params: { category: string, details: string, location?: string, time?: string, network?: string, isEducation?: boolean }): Promise<{ advice: string, steps: string[], cautions: string[] }> => {
  const ai = getAI();
  let prompt = "";
  
  if (params.isEducation) {
    prompt = `Provide a short, expert-level educational summary for "${params.category}". 
    Include what it is, common indicators, and immediate protective measures. 
    Keep it extremely concise and one-time readable.`;
  } else {
    prompt = `Provide immediate AI security advice for a "${params.category}" situation. 
    Context: ${params.details}. 
    Additional Data: Time: ${params.time || 'N/A'}, Location: ${params.location || 'N/A'}, Network: ${params.network || 'N/A'}.
    CRITICAL: Advice must be max 15 words. Provide 3-4 short next steps and 2-3 critical cautions.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          cautions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["advice", "steps", "cautions"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeIncident = async (incident: IncidentData, currency: string = '$'): Promise<{ diagnosis: string, steps: string[], reasoning: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Incident: ${incident.type}. Description: ${incident.description}. Currency: ${currency}. 
    CRITICAL: Diagnosis/Steps must be extremely short (max 7 words per line). Executive brevity required.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning: { type: Type.STRING }
        },
        required: ["diagnosis", "steps", "reasoning"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeCodeSnippet = async (code: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Audit code vulnerabilities. Use 3 short bullet points max. \n\n${code}`,
    config: { systemInstruction: "You are an elite, minimalist security bot. Only essential fixes." }
  });
  return response.text;
};
