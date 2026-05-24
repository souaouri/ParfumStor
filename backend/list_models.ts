import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set');
  process.exit(1);
}

console.log('API Key found');

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // @ts-ignore
    const result = await genAI.listModels();
    console.log('Available models:', result);
  } catch (error: any) {
    console.error('Error:', error.message);
    console.log('\nTrying alternative method...');
    
    // Try using fetch directly to see what's available
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  }
}

listModels();
