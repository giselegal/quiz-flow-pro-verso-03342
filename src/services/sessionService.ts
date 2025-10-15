/**
 * SessionService Stub
 */
export class SessionService {
  async createSession() {
    return { id: 'stub-session' };
  }

  async getSession(id: string) {
    return null;
  }
}

export const sessionService = new SessionService();
