// API Configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    timeout: 30000,
  },
  app: {
    name: "PharmaCare",
    description: "Your Trusted Online Pharmacy",
  },
} as const

export type Config = typeof config
