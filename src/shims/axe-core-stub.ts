// Stub de axe-core para builds de produção
// Mantém API mínima usada no app sem trazer dependência pesada

export interface AxeRunResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
}

const axeStub = {
  // Simula API axe.default.run
  async run(): Promise<AxeRunResult> {
    return { violations: [], passes: [], incomplete: [] };
  },
  version: 'stub'
};

export default axeStub;
