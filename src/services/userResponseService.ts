// Simplified User Response Service
export interface UserResponse {
  id: string;
  userId: string;
  responses: any[];
  createdAt: Date;
}

export const userResponseService = {
  async saveResponse(response: any): Promise<UserResponse> {
    console.log('Would save response:', response);
    return {
      id: `response_${Date.now()}`,
      userId: response.userId || 'anonymous',
      responses: response.responses || [],
      createdAt: new Date(),
    };
  },

  getResponse(id: string): string {
    console.log('Would get response:', id);
    return '';
  },

  async getResponses(userId: string): Promise<UserResponse[]> {
    console.log('Would get responses for user:', userId);
    return [];
  },

  saveStepResponse(stepId: string, response: any): void {
    console.log('Would save step response:', stepId, response);
  },

  saveUserName(userId: string, name: string): void {
    console.log('Would save user name:', userId, name);
  },

  async deleteResponse(id: string): Promise<boolean> {
    console.log('Would delete response:', id);
    return true;
  },
};

export default userResponseService;
