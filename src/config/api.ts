export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  ENDPOINTS: {
    GAMES: '/games',
    COMMENTS: '/comments',
  },
  TIMEOUT: 10000, // 10 seconds
}
