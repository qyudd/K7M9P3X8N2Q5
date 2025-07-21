import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { STEP_1_PROMPT_TEMPLATE, STEP_2_PROMPT_TEMPLATE } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInternalKnowledgeStream(workTitle: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const prompt = STEP_1_PROMPT_TEMPLATE.replace('{{WORK_TITLE}}', workTitle);
    
    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return stream;
}

export async function getVerifiedKnowledgeStream(workTitle: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const prompt = STEP_2_PROMPT_TEMPLATE.replace('{{WORK_TITLE}}', workTitle);

    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });
    
    return stream;
}