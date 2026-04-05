/** Slugs that collide with app routes — shared across all API routes */
export const RESERVED_SLUGS = new Set([
  'admin', 'api', 'login', 'signup', 'register', 'dashboard',
  'app', 'www', 'help', 'support', 'billing', 'settings',
  'auth', 'oauth', 'callback', 'webhook', 'webhooks',
  'static', 'assets', 'public', 'health', 'status',
]);
