import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Add this check back
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set in .env file');
  process.exit(1);
}

console.log('API Key found:', apiKey.substring(0, 5) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
  const modelsToTry = [
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-2.5-flash',
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`\nTrying ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hi"');
      console.log(`✅ ${modelName} works!`);
      console.log(`Response: ${result.response.text()}`);
      return;
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message.includes('quota') ? 'Quota exceeded' : 'Other error');
    }
  }
  
  console.log('\n⚠️ All models failed. You have exceeded your free quota.');
  console.log('Solutions:');
  console.log('1. Wait 24 hours for quota to reset');
  console.log('2. Enable billing on Google AI Studio');
}

runTest();