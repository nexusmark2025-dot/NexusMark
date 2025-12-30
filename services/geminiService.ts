import { GoogleGenAI, Type } from '@google/genai';
import { Job, JobDetails } from '../types';
import { MOCK_JOBS } from '../mock-data/jobs';

// This would be in a secure environment variable in a real app
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchAdminJobs = async (): Promise<Job[]> => {
    // Fetches only the jobs posted by the admin from local storage.
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedJobs: Job[] = JSON.parse(localStorage.getItem('postedJobs') || '[]');
            resolve(storedJobs);
        }, 500); // 500ms delay to simulate network latency
    });
};


export const findJobsWithAI = async (query: string): Promise<Job[]> => {
    if (!query.trim()) {
        return [];
    }
    
    const model = 'gemini-3-flash-preview';
    const jobSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            location: { type: Type.STRING },
            lastDate: { type: Type.STRING, description: 'In YYYY-MM-DD format' },
            summary: { type: Type.STRING },
            category: { type: Type.STRING },
            qualification: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ['id', 'title', 'department', 'location', 'lastDate', 'summary', 'category', 'qualification']
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `User Query: "${query}"\n\nAvailable Jobs Context:\n${JSON.stringify(MOCK_JOBS, null, 2)}\n\nAnalyze the user's query and return a JSON array of the most relevant job objects from the provided context. If no jobs are relevant, return an empty array.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: jobSchema
                },
                systemInstruction: "You are an intelligent job search assistant for a government job portal. Your task is to find relevant jobs from the provided JSON context based on the user's query. Only return jobs found in the context. Ensure the response is a valid JSON array."
            }
        });
        
        const jsonText = response.text.trim();
        // Handle cases where the model might return a non-JSON string
        if (jsonText.startsWith('[') && jsonText.endsWith(']')) {
             return JSON.parse(jsonText);
        }
        console.error("AI returned non-JSON response:", jsonText);
        return []; // Return empty if response is not a valid array
    } catch (error) {
        console.error("Error calling Gemini API for job search:", error);
        throw new Error("AI search failed. Please try again.");
    }
};


export const fetchJobDetails = async (job: Job): Promise<JobDetails> => {
     const model = 'gemini-3-flash-preview';
     const prompt = `Generate a detailed job description in Markdown format for the following government job opening. The description should be comprehensive, well-structured, and easy to read. Include the following sections using Markdown formatting (e.g., ### **Section Title**): **Job Description**, **Eligibility Criteria** (with sub-sections for Age Limit and Educational Qualification), **Salary / Pay Scale**, **Selection Process**, **Important Dates**, and **How to Apply**. Use the provided data to fill in the details. Be professional and informative.

    Job Data:
    - Title: ${job.title}
    - Department: ${job.department}
    - Summary: ${job.summary}
    - Qualifications: ${job.qualification.join(', ')}
    - Last Date to Apply: ${new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric'})}
    - Location: ${job.location}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful AI assistant that creates detailed and professional job descriptions in Markdown format for a government job portal."
            }
        });
        return { content: response.text };
    } catch (error) {
        console.error("Error calling Gemini API for job details:", error);
        throw new Error("Failed to generate job details.");
    }
};