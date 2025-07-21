import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { STEP_1_PROMPT_TEMPLATE, STEP_2_PROMPT_TEMPLATE } from '../constants';

function getAiClient(apiKey: string) {
    if (!apiKey) {
        throw new Error("API_KEY is not provided.");
    }
    return new GoogleGenAI({ apiKey });
}

export async function getInternalKnowledgeStream(apiKey: string, workTitle: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const ai = getAiClient(apiKey);
    const prompt = STEP_1_PROMPT_TEMPLATE.replace('{{WORK_TITLE}}', workTitle);
    
    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return stream;
}

export async function getVerifiedKnowledgeStream(apiKey: string, workTitle: string, step1Result: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const ai = getAiClient(apiKey);
    const prompt = STEP_2_PROMPT_TEMPLATE
        .replace('{{WORK_TITLE}}', workTitle)
        .replace('{{STEP_1_RESULT}}', step1Result);

    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });
    
    return stream;
}