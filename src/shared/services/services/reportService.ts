// @ts-nocheck
// =============================================================================
// SISTEMA DE RELATÓRIOS PDF
// Geração de relatórios em PDF para analytics e resultados de quiz
// =============================================================================

// =============================================================================
// TIPOS
// =============================================================================

export interface ReportData {
  title: string;
  subtitle?: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalViews: number;
    totalCompletions: number;
    conversionRate: number;
    averageTime: number;
  };
  charts: {
    completionTrend: { date: string; completions: number }[];
    deviceBreakdown: { device: string; percentage: number }[];
    sourceBreakdown: { source: string; visitors: number }[];
  };
  topQuestions: {
    question: string;
    correctRate: number;
    totalAnswers: number;
  }[];
  userInsights: {
    totalUsers: number;
    returningUsers: number;
    newUsers: number;
    averageScore: number;
  };
}

export interface PDFOptions {
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeCharts: boolean;
  includeRawData: boolean;
  watermark?: string;
  customLogo?: string;
}

// =============================================================================
// SERVIÇO DE RELATÓRIOS
// =============================================================================

export class ReportService {
  // Gerar relatório completo em PDF
  static async generateAnalyticsReport(
    quizId: string,
    options: PDFOptions = {
      format: 'A4',
      orientation: 'portrait',
      includeCharts: true,
      includeRawData: false,
    }
  ): Promise<Blob> {
    try {
      // Buscar dados do relatório
      const reportData = await this.gatherReportData(quizId);

      // Criar documento PDF
      const pdfBlob = await this.createPDFDocument(reportData, options);

      return pdfBlob;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  // Gerar relatório resumido
  static async generateSummaryReport(quizId: string): Promise<Blob> {
    try {
      const reportData = await this.gatherReportData(quizId);

      const summaryHTML = this.generateSummaryHTML(reportData);
      const pdfBlob = await this.htmlToPDF(summaryHTML);

      return pdfBlob;
    } catch (error) {
      console.error('Erro ao gerar relatório resumido:', error);
      throw error;
    }
  }

  // Gerar relatório de resultados individuais
  static async generateResultsReport(
    quizId: string,
    userId: string,
    sessionId: string
  ): Promise<Blob> {
    try {
      // Buscar dados da sessão específica
      const sessionData = await this.getSessionData(quizId, userId, sessionId);

      const resultsHTML = this.generateResultsHTML(sessionData);
      const pdfBlob = await this.htmlToPDF(resultsHTML);

      return pdfBlob;
    } catch (error) {
      console.error('Erro ao gerar relatório de resultados:', error);
      throw error;
    }
  }

  // Buscar dados para o relatório
  private static async gatherReportData(quizId: string): Promise<ReportData> {
    // Simular dados de relatório (em produção, viria do Supabase)
    const mockData: ReportData = {
      title: 'Relatório de Analytics do Quiz',
      subtitle: 'Análise de Performance e Engajamento',
      period: {
        start: '2025-01-01',
        end: '2025-01-25',
      },
      summary: {
        totalViews: 1250,
        totalCompletions: 892,
        conversionRate: 71.36,
        averageTime: 4.2,
      },
      charts: {
        completionTrend: [
          { date: '2025-01-01', completions: 25 },
          { date: '2025-01-02', completions: 32 },
          { date: '2025-01-03', completions: 28 },
          { date: '2025-01-04', completions: 45 },
          { date: '2025-01-05', completions: 38 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', percentage: 45.2 },
          { device: 'Mobile', percentage: 42.8 },
          { device: 'Tablet', percentage: 12.0 },
        ],
        sourceBreakdown: [
          { source: 'Direct', visitors: 485 },
          { source: 'Social Media', visitors: 312 },
          { source: 'Email', visitors: 287 },
          { source: 'Search', visitors: 166 },
        ],
      },
      topQuestions: [
        {
          question: 'Qual seu estilo de vida preferido?',
          correctRate: 85.2,
          totalAnswers: 892,
        },
        {
          question: 'Como você gosta de passar o tempo livre?',
          correctRate: 78.9,
          totalAnswers: 856,
        },
        {
          question: 'Qual ambiente é mais atrativo para você?',
          correctRate: 71.3,
          totalAnswers: 798,
        },
      ],
      userInsights: {
        totalUsers: 1250,
        returningUsers: 287,
        newUsers: 963,
        averageScore: 78.5,
      },
    };

    return mockData;
  }

  // Buscar dados de uma sessão específica
  private static async getSessionData(quizId: string, userId: string, sessionId: string) {
    // Simular dados de sessão
    return {
      quiz_title: 'Quiz de Personalidade',
      user_name: 'Usuário Teste',
      completed_at: '2025-01-25T10:30:00Z',
      score: 85,
      total_questions: 10,
      correct_answers: 8,
      time_taken: '4 minutos 32 segundos',
      answers: [
        {
          question: 'Qual seu estilo de vida preferido?',
          user_answer: 'Minimalista',
          correct_answer: 'Minimalista',
          is_correct: true,
          explanation:
            'Ótima escolha! O estilo minimalista valoriza simplicidade e funcionalidade.',
        },
        {
          question: 'Como você gosta de passar o tempo livre?',
          user_answer: 'Lendo um livro',
          correct_answer: 'Lendo um livro',
          is_correct: true,
          explanation: 'A leitura é uma excelente forma de relaxamento e aprendizado.',
        },
      ],
      recommendations: [
        'Explore mais conteúdos sobre minimalismo',
        'Participe de grupos de leitura online',
        'Considere criar um ambiente de leitura em casa',
      ],
    };
  }

  // Criar documento PDF
  private static async createPDFDocument(data: ReportData, options: PDFOptions): Promise<Blob> {
    const html = this.generateReportHTML(data, options);
    return await this.htmlToPDF(html, options);
  }

  // Gerar HTML do relatório completo
  private static generateReportHTML(data: ReportData, options: PDFOptions): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4A90E2;
        }
        .header h1 {
          color: #4A90E2;
          margin: 0;
          font-size: 24px;
        }
        .header h2 {
          color: #666;
          margin: 5px 0;
          font-size: 16px;
          font-weight: normal;
        }
        .period {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .metric {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .metric-value {
          font-size: 32px;
          font-weight: bold;
          color: #4A90E2;
          margin-bottom: 5px;
        }
        .metric-label {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin: 40px 0;
        }
        .section h3 {
          color: #4A90E2;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .table th,
        .table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .table th {
          background: #f8f9fa;
          font-weight: bold;
        }
        .chart-placeholder {
          background: #f8f9fa;
          height: 200px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          margin: 20px 0;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          opacity: 0.1;
          font-size: 48px;
          font-weight: bold;
          z-index: -1;
        }
      </style>
    </head>
    <body>
      ${options.watermark ? `<div class="watermark">${options.watermark}</div>` : ''}
      
      <div class="header">
        <h1>${data.title}</h1>
        <h2>${data.subtitle || ''}</h2>
      </div>

      <div class="period">
        <strong>Período:</strong> ${new Date(data.period.start).toLocaleDateString('pt-BR')} - ${new Date(data.period.end).toLocaleDateString('pt-BR')}
      </div>

      <div class="summary">
        <div class="metric">
          <div class="metric-value">${data.summary.totalViews.toLocaleString()}</div>
          <div class="metric-label">Total de Visualizações</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.totalCompletions.toLocaleString()}</div>
          <div class="metric-label">Total de Conclusões</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.conversionRate}%</div>
          <div class="metric-label">Taxa de Conversão</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.averageTime}min</div>
          <div class="metric-label">Tempo Médio</div>
        </div>
      </div>

      ${
        options.includeCharts
          ? `
      <div class="section">
        <h3>Gráficos de Performance</h3>
        <div class="chart-placeholder">
          Gráfico de Tendência de Conclusões
          <br><small>(Gráfico seria renderizado aqui com biblioteca de charts)</small>
        </div>
        <div class="chart-placeholder">
          Breakdown por Dispositivo
          <br><small>(Gráfico seria renderizado aqui com biblioteca de charts)</small>
        </div>
      </div>
      `
          : ''
      }

      <div class="section">
        <h3>Top Perguntas por Performance</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Pergunta</th>
              <th>Taxa de Acerto</th>
              <th>Total de Respostas</th>
            </tr>
          </thead>
          <tbody>
            ${data.topQuestions
              .map(
                q => `
              <tr>
                <td>${q.question}</td>
                <td>${q.correctRate}%</td>
                <td>${q.totalAnswers}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Insights de Usuários</h3>
        <div class="summary">
          <div class="metric">
            <div class="metric-value">${data.userInsights.totalUsers.toLocaleString()}</div>
            <div class="metric-label">Total de Usuários</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.userInsights.newUsers.toLocaleString()}</div>
            <div class="metric-label">Novos Usuários</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.userInsights.returningUsers.toLocaleString()}</div>
            <div class="metric-label">Usuários Recorrentes</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.userInsights.averageScore}%</div>
            <div class="metric-label">Pontuação Média</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Quiz Quest - Sistema de Analytics Avançado</p>
      </div>
    </body>
    </html>
    `;
  }

  // Gerar HTML do relatório resumido
  private static generateSummaryHTML(data: ReportData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Resumido</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #4A90E2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório Resumido</h1>
        <p>Período: ${new Date(data.period.start).toLocaleDateString('pt-BR')} - ${new Date(data.period.end).toLocaleDateString('pt-BR')}</p>
      </div>
      <div class="summary">
        <div class="metric">
          <div class="metric-value">${data.summary.totalViews}</div>
          <div>Visualizações</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.totalCompletions}</div>
          <div>Conclusões</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.conversionRate}%</div>
          <div>Taxa de Conversão</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.averageTime}min</div>
          <div>Tempo Médio</div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Gerar HTML do relatório de resultados
  private static generateResultsHTML(sessionData: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Resultado do Quiz</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .score { background: #4A90E2; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .answer { margin: 15px 0; padding: 15px; border-left: 4px solid #4A90E2; background: #f8f9fa; }
        .correct { border-left-color: #28a745; }
        .incorrect { border-left-color: #dc3545; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${sessionData.quiz_title}</h1>
        <p>Resultado para: ${sessionData.user_name}</p>
        <p>Concluído em: ${new Date(sessionData.completed_at).toLocaleString('pt-BR')}</p>
      </div>
      
      <div class="score">
        <h2>Sua Pontuação: ${sessionData.score}%</h2>
        <p>${sessionData.correct_answers} de ${sessionData.total_questions} questões corretas</p>
        <p>Tempo: ${sessionData.time_taken}</p>
      </div>

      <h3>Respostas Detalhadas:</h3>
      ${sessionData.answers
        .map(
          (answer: any) => `
        <div class="answer ${answer.is_correct ? 'correct' : 'incorrect'}">
          <h4>${answer.question}</h4>
          <p><strong>Sua resposta:</strong> ${answer.user_answer}</p>
          <p><strong>Resposta correta:</strong> ${answer.correct_answer}</p>
          ${answer.explanation ? `<p><strong>Explicação:</strong> ${answer.explanation}</p>` : ''}
        </div>
      `
        )
        .join('')}

      <h3>Recomendações:</h3>
      <ul>
        ${sessionData.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
      </ul>
    </body>
    </html>
    `;
  }

  // Converter HTML para PDF
  private static async htmlToPDF(html: string, options?: PDFOptions): Promise<Blob> {
    // Simulação de conversão HTML para PDF
    // Em produção, usaria uma biblioteca como Puppeteer, jsPDF ou similar

    const pdfContent = `
    %PDF-1.4
    1 0 obj
    <<
    /Type /Catalog
    /Pages 2 0 R
    >>
    endobj
    
    2 0 obj
    <<
    /Type /Pages
    /Kids [3 0 R]
    /Count 1
    >>
    endobj
    
    3 0 obj
    <<
    /Type /Page
    /Parent 2 0 R
    /MediaBox [0 0 612 792]
    /Contents 4 0 R
    >>
    endobj
    
    4 0 obj
    <<
    /Length 44
    >>
    stream
    BT
    /F1 12 Tf
    100 700 Td
    (Relatório PDF Simulado) Tj
    ET
    endstream
    endobj
    
    xref
    0 5
    0000000000 65535 f 
    0000000009 00000 n 
    0000000058 00000 n 
    0000000115 00000 n 
    0000000207 00000 n 
    trailer
    <<
    /Size 5
    /Root 1 0 R
    >>
    startxref
    301
    %%EOF
    `;

    // Retornar blob simulado
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Download do relatório
  static downloadReport(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Gerar múltiplos formatos
  static async generateMultipleFormats(quizId: string) {
    const reportData = await this.gatherReportData(quizId);

    return {
      pdf: await this.generateAnalyticsReport(quizId),
      json: new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      }),
      csv: await this.generateCSVReport(reportData),
      html: new Blob(
        [
          this.generateReportHTML(reportData, {
            format: 'A4',
            orientation: 'portrait',
            includeCharts: true,
            includeRawData: false,
          }),
        ],
        { type: 'text/html' }
      ),
    };
  }

  // Gerar relatório CSV
  private static async generateCSVReport(data: ReportData): Promise<Blob> {
    const csvContent = [
      'Métrica,Valor',
      `Total de Visualizações,${data.summary.totalViews}`,
      `Total de Conclusões,${data.summary.totalCompletions}`,
      `Taxa de Conversão,${data.summary.conversionRate}%`,
      `Tempo Médio,${data.summary.averageTime} min`,
      '',
      'Pergunta,Taxa de Acerto,Total de Respostas',
      ...data.topQuestions.map(q => `"${q.question}",${q.correctRate}%,${q.totalAnswers}`),
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }
}
