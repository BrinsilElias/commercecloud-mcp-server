import { z } from "zod"

export const envSchema = z.object({
  SFCC_INSTANCE_URL: z.string().url(),
  SFCC_SITE_ID: z.string(),
  SFCC_CLIENT_ID: z.string(),
  SFCC_CLIENT_SECRET: z.string(),
  SFCC_VERSION: z.string(),
  SFCC_BM_USER_ID: z.string(),
  SFCC_BM_USER_SECURITY_TOKEN: z.string(),
})