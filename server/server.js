const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://farm-ease-eis2tu7el-samarthunhale-alts-projects.vercel.app',
  'https://farm-ease-2855tsybl-samarthunhale-alts-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);