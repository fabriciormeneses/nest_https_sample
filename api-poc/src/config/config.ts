import { ConfigProps } from './interfaces/config.interface';

export const config = (): ConfigProps => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  tokenCacheTime: parseInt(process.env.TOKEN_CACHE_TIME),
  api: {
    fengAuthUrl: process.env.FENG_AUTH_URL,
    fengApiUrl: process.env.FENG_API_URL,
    fengLogin: process.env.AUTH_LOGIN,
    fengPass: process.env.AUTH_PASS,
    httpTimeout: parseInt(process.env.FENG_API_TIMEOUT, 10),
  },
  vtex: {
    clSearchUrl: process.env.VTEX_CL_SEARCH_URL,
    clPathUrl: process.env.VTEX_CL_PATCH_URL,
    appKey: process.env.VTEX_KEY,
    appToken: process.env.VTEX_TOKEN,
  },
});
