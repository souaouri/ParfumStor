import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set in your .env file.');
  process.exit(1);
}

console.log('Using API Key:', apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4));

const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
  try {
    console.log('Listing available models...');
    // Correct way to list models is directly from the genAI instance
    const models = await genAI.listModels();
    
    console.log('✅ Success! Available models that support "generateContent":');
    for (const m of models) {
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(m.name);
      }
    }

  } catch (error) {
    console.error('❌ Error listing models:');
    console.error(error);
  }
}

runTest();
