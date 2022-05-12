declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FAUNA_SECRET_KEY: string;
      COOKIE_SIGNING_SECRET: string;
      JWT_SIGNING_KEY: string;
    }
  }
}

export {};
