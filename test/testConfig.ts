import { FilemakerDataAPIOptions } from '../src';

// Validate environment variables
function loadEnvVar(envVar: string): string {
  const value = process.env[envVar];

  if (!value) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }

  return value;
}

export const testConfig: FilemakerDataAPIOptions = {
  host: loadEnvVar('FILEMAKER_HOST'),
  database: loadEnvVar('FILEMAKER_DATABASE'),
  username: loadEnvVar('FILEMAKER_USER'),
  password: loadEnvVar('FILEMAKER_PASSWORD'),
  loggingConfig: {
    logDebugToConsole: true,
  },
};
