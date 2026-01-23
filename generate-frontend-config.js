// generate-frontend-config.js
// Script to extract backend configuration and generate frontend environment variables

const fs = require('fs');
const path = require('path');

function extractConfigValues() {
  try {
    // Read backend application.properties
    const backendConfigPath = path.join(__dirname, 'productdevelopment', 'src', 'main', 'resources', 'application.properties');
    const backendConfig = fs.readFileSync(backendConfigPath, 'utf8');

    // Extract timeout values using regex
    const sessionTimeoutMatch = backendConfig.match(/app\.session\.timeout\.minutes=(\d+)/);
    const jwtExpirationMatch = backendConfig.match(/app\.jwt\.expiration\.minutes=(\d+)/);

    const sessionTimeoutMinutes = sessionTimeoutMatch ? sessionTimeoutMatch[1] : '5';
    const jwtExpirationMinutes = jwtExpirationMatch ? jwtExpirationMatch[1] : '60';

    // Create frontend environment variables
    const envContent = `# Generated from backend configuration - DO NOT EDIT MANUALLY
VITE_SESSION_TIMEOUT_MINUTES=${sessionTimeoutMinutes}
VITE_JWT_EXPIRATION_MINUTES=${jwtExpirationMinutes}
`;

    // Write to frontend .env file
    const frontendEnvPath = path.join(__dirname, 'tailadmin-react-pro-2.0-main', '.env.production');
    fs.writeFileSync(frontendEnvPath, envContent);

    console.log(`✅ Frontend environment variables generated successfully:`);
    console.log(`   Session timeout: ${sessionTimeoutMinutes} minutes`);
    console.log(`   JWT expiration: ${jwtExpirationMinutes} minutes`);
    console.log(`   File: ${frontendEnvPath}`);

    // Also create a development version
    const frontendDevEnvPath = path.join(__dirname, 'tailadmin-react-pro-2.0-main', '.env.development');
    fs.writeFileSync(frontendDevEnvPath, envContent);
    
    console.log(`   Development file: ${frontendDevEnvPath}`);

  } catch (error) {
    console.error('❌ Error generating frontend config:', error.message);
    process.exit(1);
  }
}

// Run the function
extractConfigValues();