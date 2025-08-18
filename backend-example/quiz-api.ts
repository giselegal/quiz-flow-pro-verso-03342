/**
 * Exemplo de implementação de backend para API de Quiz
 * Este é um exemplo com Express.js + MongoDB/Prisma
 */

// models/Quiz.ts (exemplo com Prisma)
/*
model Quiz {
  id          String   @id @default(cuid())
  title       String
  description String?
  userId      String
  isPublished Boolean  @default(false)
  questions   Json     // Array de QuizQuestion
  metadata    Json?    // Metadados adicionais
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  version     Int      @default(1)
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@map("quizzes")
}
*/

// routes/quizzes.ts (exemplo com Express)
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { validateQuiz } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/quizzes - Listar quizzes do usuário
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const quizzes = await prisma.quiz.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        version: true,
        _count: {
          select: {
            // Aqui você poderia contar relacionamentos como respostas
          },
        },
      },
    });

    const total = await prisma.quiz.count({ where: { userId } });

    res.json({
      success: true,
      data: quizzes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
});

// GET /api/quizzes/:id - Buscar quiz por ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        userId, // Garantir que o usuário só acesse seus próprios quizzes
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz não encontrado',
      });
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
});

// POST /api/quizzes - Criar novo quiz
router.post('/', authenticate, validateQuiz, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, description, questions, isPublished, metadata } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        userId,
        questions,
        isPublished: isPublished || false,
        metadata: {
          ...metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar quiz',
    });
  }
});

// PUT /api/quizzes/:id - Atualizar quiz
router.put('/:id', authenticate, validateQuiz, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, questions, isPublished, metadata } = req.body;

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await prisma.quiz.findFirst({
      where: { id, userId },
    });

    if (!existingQuiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz não encontrado',
      });
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        questions,
        isPublished,
        metadata: {
          ...metadata,
          updatedAt: new Date().toISOString(),
          version: (existingQuiz.version || 1) + 1,
        },
      },
    });

    res.json({
      success: true,
      data: updatedQuiz,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar quiz',
    });
  }
});

// DELETE /api/quizzes/:id - Deletar quiz
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const quiz = await prisma.quiz.findFirst({
      where: { id, userId },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz não encontrado',
      });
    }

    await prisma.quiz.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Quiz deletado com sucesso',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar quiz',
    });
  }
});

// POST /api/quizzes/:id/duplicate - Duplicar quiz
router.post('/:id/duplicate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const originalQuiz = await prisma.quiz.findFirst({
      where: { id, userId },
    });

    if (!originalQuiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz não encontrado',
      });
    }

    const duplicatedQuiz = await prisma.quiz.create({
      data: {
        title: `${originalQuiz.title} (Cópia)`,
        description: originalQuiz.description,
        userId,
        questions: originalQuiz.questions,
        isPublished: false, // Cópias sempre começam como rascunho
        metadata: {
          ...originalQuiz.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          originalQuizId: originalQuiz.id,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: duplicatedQuiz,
    });
  } catch (error) {
    console.error('Error duplicating quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao duplicar quiz',
    });
  }
});

export default router;

// middleware/auth.ts
export const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação necessário',
      });
    }

    // Verificar e decodificar o JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }
};

// middleware/validation.ts
export const validateQuiz = (req: any, res: any, next: any) => {
  const { title, questions } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Título é obrigatório',
    });
  }

  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({
      success: false,
      error: 'Questões são obrigatórias',
    });
  }

  // Validar estrutura das questões
  for (const question of questions) {
    if (!question.id || !question.title || !Array.isArray(question.options)) {
      return res.status(400).json({
        success: false,
        error: 'Estrutura de questão inválida',
      });
    }
  }

  next();
};

// app.ts (configuração principal)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import quizzesRouter from './routes/quizzes';

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/quizzes', quizzesRouter);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
