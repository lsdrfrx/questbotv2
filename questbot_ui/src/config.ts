export const config = {
  QUESTBOT_API_HOST: import.meta.env.VITE_QUESTBOT_API_HOST || 'http://localhost:3000/api',
  QUESTBOT_API_AUTH_SECRET: import.meta.env.QUESTBOT_API_AUTH_SECRET || 'secret',
  QUESTBOT_API_AUTH_TTL: import.meta.env.QUESTBOT_API_AUTH_TTL || 3600 * 24 * 7,
}
