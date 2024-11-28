/* eslint-disable import/no-anonymous-default-export */
/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./db/schema.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url:"postgresql://ai-interview-mocker_owner:ol7yrzTEaI5k@ep-lingering-band-a10ie9v5-pooler.ap-southeast-1.aws.neon.tech/pdf?sslmode=require",
    }
};