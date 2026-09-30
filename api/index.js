/**
 * Vercel serverless entry point.
 *
 * Vercel treats every file under /api as a function. Exporting the Express app
 * directly lets Vercel hand each request straight to it, so all the routing in
 * /server keeps working unchanged. vercel.json rewrites every /api/* path here.
 */
export { default } from '../server/app.js';
