const bcrypt = require('bcryptjs');
const hash = '$2a$12$ctvPAIxrIM17y85Brk7CLeev8iCMXy5UMGEOU5c8lo1KpSGvELz9m';
bcrypt.compare('ImpactEnergy2026!', hash).then(r => {
  console.log('Password "ImpactEnergy2026!" valid:', r);
  // Also log what email env would be read as
  const dotenv = require('fs').readFileSync('.env.local', 'utf8');
  const emailLine = dotenv.split('\n').find(l => l.startsWith('ADMIN_EMAIL'));
  console.log('ADMIN_EMAIL line from .env.local:', emailLine);
}).catch(console.error);
