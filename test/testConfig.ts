import { FilemakerDataAPIOptions } from '../src';
import dotenv from 'dotenv';
import { configureLogging } from '../src/helpers/configureLogging';
dotenv.config();

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
};

export const testLayout = process.env.FILEMAKER_LAYOUT || 'Testing';

configureLogging({
  logDebugToConsole: true,
});
