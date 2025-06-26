import { onRequest } from "firebase-functions/v2/https";

// Serve Next.js app
export const nextjsApp = onRequest(
  {
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 300,
  },
  (req, res) => {
    // For now, redirect to a simple message
    // This is a placeholder - full Next.js integration requires more setup
    res.status(200).send(`
      <html>
        <body>
          <h1>Next.js App with Clerk</h1>
          <p>Your Next.js app with Clerk middleware needs to be deployed to 
          a platform that supports SSR.</p>
          <p>Consider deploying to:</p>
          <ul>
            <li><a href="https://vercel.com">Vercel</a> (recommended for 
            Next.js)</li>
            <li><a href="https://railway.app">Railway</a></li>
            <li><a href="https://render.com">Render</a></li>
          </ul>
        </body>
      </html>
    `);
  },
);
