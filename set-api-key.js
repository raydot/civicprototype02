// Simple script to set OpenAI API key in localStorage
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('OpenAI API Key Setup Utility');
console.log('============================');
console.log('This utility will create a small HTML file that will set your OpenAI API key in localStorage.');
console.log('Your API key will be stored in your browser\'s localStorage for the application to use.');

rl.question('Enter your OpenAI API key (starts with sk-): ', (apiKey) => {
  if (!apiKey.trim() || !apiKey.startsWith('sk-')) {
    console.log('Error: Invalid API key format. API keys should start with "sk-"');
    rl.close();
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>API Key Setup</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.5;
    }
    .success {
      color: #10b981;
      font-weight: bold;
    }
    .container {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>OpenAI API Key Setup</h1>
  <div class="container">
    <p>Setting API key in localStorage...</p>
    <p id="status"></p>
  </div>

  <script>
    // Store the API key in localStorage
    try {
      localStorage.setItem('openai_api_key', '${apiKey}');
      document.getElementById('status').innerHTML = '<span class="success">✓ API key successfully stored!</span><br><br>You can now close this page and return to the application.';
    } catch (error) {
      document.getElementById('status').innerHTML = 'Error: ' + error.message;
    }
  </script>
</body>
</html>
  `;

  const outputPath = path.join(__dirname, 'api-key-setup.html');
  
  fs.writeFileSync(outputPath, htmlContent);
  
  console.log('\nSuccess! HTML file created at:', outputPath);
  console.log('Open this file in your browser to set the API key.');
  console.log('After opening the file, you can return to the application and the API key will be available.');
  
  rl.close();
});
