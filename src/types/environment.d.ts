export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number;
      SALT_FACTOR: number;
      MAIL_HOST:string;
      MAIL_PORT:number;
      APP_ENV: 'test' | 'dev' | 'prod';
    }
  }
}
