import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Quiz endpoints
app.get("/api/quizzes", (req, res) => {
  // Mock data - replace with actual database queries
  res.json([]);
});

app.post("/api/quizzes", (req, res) => {
  // Mock creation - replace with actual database operations
  res.json({ id: Date.now().toString(), ...req.body });
});

app.get("/api/quizzes/:id", (req, res) => {
  // Mock data - replace with actual database queries
  res.json({ id: req.params.id, title: "Mock Quiz" });
});

// Generic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
