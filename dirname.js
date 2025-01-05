import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __filename et __dirname sont des variables standard en CommonJS, mais tu peux les recréer en ESM comme ceci :
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;