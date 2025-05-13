import { configDotenv } from 'dotenv'

configDotenv()

export const config = {
  QUESTBOT_API_HOST: import.meta.env.QUESTBOT_API_HOST || 'localhost',
  QUESTBOT_API_PORT: import.meta.env.QUESTBOT_API_PORT || 3000,
  QUESTBOT_API_AUTH_SECRET: import.meta.env.QUESTBOT_API_AUTH_SECRET || 'secret',
  QUESTBOT_API_AUTH_TTL: import.meta.env.QUESTBOT_API_AUTH_TTL || 3600 * 24 * 7,
  QUESTBOT_API_AUTH_BOT_SECRET: import.meta.env.QUESTBOT_API_AUTH_BOT_SECRET || 'secret',
}
