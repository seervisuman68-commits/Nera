import app from '../api/index';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ NERA Full-Stack API Server is running locally on http://localhost:${PORT}`);
  console.log(`📡 Vercel serverless entrypoint available at /api`);
});

export default app;
