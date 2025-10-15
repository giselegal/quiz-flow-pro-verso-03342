/**
 * ResultOrchestrator Stub
 */
export class ResultOrchestrator {
  async calculateResult(data: any) {
    return { score: 0, result: 'stub' };
  }
}

export const resultOrchestrator = new ResultOrchestrator();
