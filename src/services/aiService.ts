import { DecisionResult } from '../engine/solver';
import { Language } from '../types';

export interface AiExplanationResult {
  narrative: string;
  source: 'groq' | 'local_fallback';
  modelUsed?: string;
}

/**
 * Local Deterministic Explanation Synthesizer
 * 100% reliable offline fallback producing natural, empathetic farmer advice
 * Strictly derived from structured decision-engine output.
 */
export function generateLocalFallbackExplanation(
  result: DecisionResult,
  language: Language
): string {
  const { assessment, primaryRecommendation } = result;
  const isHi = language === 'hi';
  const rec = primaryRecommendation;
  const resourceName = isHi
    ? (rec.nearestResource?.nameHi || 'स्थानीय कस्टम हायरिंग सेंटर')
    : (rec.nearestResource?.name || 'Local Custom Hiring Centre');

  if (isHi) {
    return `किसान भाइयों के लिए विशेष परामर्श:

आपके खेत में ${assessment.acreage} एकड़ में लगभग ${assessment.residueTonnes} टन अवशेष है और अगली बुवाई में केवल ${assessment.windowDays} दिन का समय शेष है। इस स्थिति में पराली जलाए बिना सबसे सुरक्षित और अनुशंसित तरीका "${rec.pathway.nameHi}" है।

यह विकल्प क्यों चुना गया:
1. समय की अनुकूलता: यह कार्य लगभग ${rec.turnaroundDays} दिन में पूरा हो जाता है, जिससे आपकी गेहूं या रबी बुवाई समय पर हो सकेगी।
2. नजदीकी मशीनरी: ${resourceName} आपके क्षेत्र से लगभग ${rec.distanceKm} किमी की दूरी पर है, जिससे उपकरण का परिवहन शुल्क कम रहेगा।
3. किफायती लागत: आपकी प्राथमिकता के अनुसार अनुमानित खर्च लगभग ₹${rec.estimatedCostPerAcreINR} प्रति एकड़ है।

महत्वपूर्ण सलाह: खेत में कटाई से पूर्व ${resourceName} के संचालक से संपर्क कर मशीन की बुकिंग सुनिश्चित करें। यह एक निर्णय-सहायक अनुमान है, अतः स्थानीय दरों की पुष्टि स्वयं करें।`;
  }

  return `Field Operational Advisory for Farmer:

For your ${assessment.acreage}-acre field with approximately ${assessment.residueTonnes} tonnes of residue and a tight ${assessment.windowDays}-day sowing window, the recommended management pathway is "${rec.pathway.name}".

Why this option ranked first:
1. Turnaround Time: Field operations require ~${rec.turnaroundDays} days, fitting comfortably within your ${assessment.windowDays}-day window before winter planting.
2. Local Access: ${resourceName} is located within ${rec.distanceKm} km with compatible equipment registered in the cluster.
3. Priority Alignment: Reflects your preference for ${assessment.farmerPriority.replace('_', ' ')} with an estimated operating expense of approx ₹${rec.estimatedCostPerAcreINR}/acre.

Notice: Confirm machinery booking and local diesel rates directly with the Custom Hiring Centre prior to field preparation.`;
}

/**
 * AI Narrative Generator
 * Calls Groq API if VITE_GROQ_API_KEY is present in environment;
 * otherwise gracefully falls back to the deterministic synthesizer.
 */
export async function generateNarrativeExplanation(
  result: DecisionResult,
  language: Language
): Promise<AiExplanationResult> {
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return {
      narrative: generateLocalFallbackExplanation(result, language),
      source: 'local_fallback',
    };
  }

  try {
    const prompt = `You are the AgriCycle Decision Translator. You receive structured factual data from a deterministic agricultural solver.
You must NEVER invent names, machinery, distances, rates, or dates not present in the payload.
Explain the recommendation clearly in practical, respectful farmer language.
Payload:
- Crop: ${result.assessment.crop} (${result.assessment.residueTonnes} tonnes on ${result.assessment.acreage} acres)
- Location: ${result.assessment.village}, ${result.assessment.district}, ${result.assessment.state}
- Sowing Window: ${result.assessment.windowDays} days
- Priority: ${result.assessment.farmerPriority}
- Recommended Pathway: ${result.primaryRecommendation.pathway.name} (Suitability Score: ${result.primaryRecommendation.suitabilityScore}/100)
- Turnaround: ${result.primaryRecommendation.turnaroundDays} days
- Cost: ₹${result.primaryRecommendation.estimatedCostPerAcreINR}/acre
- Nearest CHC: ${result.primaryRecommendation.nearestResource?.name || 'Local CHC'} (${result.primaryRecommendation.distanceKm} km away)
Language: ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an agricultural advisory assistant. Never hallucinate facts or invent resources.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 350,
      })
    });

    if (!response.ok) {
      console.warn('Groq API request failed, utilizing local deterministic fallback.');
      return {
        narrative: generateLocalFallbackExplanation(result, language),
        source: 'local_fallback',
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content && content.trim().length > 20) {
      return {
        narrative: content.trim(),
        source: 'groq',
        modelUsed: 'llama-3.1-8b-instant',
      };
    }

    return {
      narrative: generateLocalFallbackExplanation(result, language),
      source: 'local_fallback',
    };
  } catch (error) {
    console.warn('Groq connection error, falling back smoothly to deterministic engine:', error);
    return {
      narrative: generateLocalFallbackExplanation(result, language),
      source: 'local_fallback',
    };
  }
}
