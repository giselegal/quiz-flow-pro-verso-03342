import { EventEmitter } from '@/lib/utils/EventEmitter';

export interface NavigationState {
    currentRoute: string;
    history: string[];
}

export interface NavigationTransaction {
    from: string;
    to: string;
    timestamp: number;
}

export interface RouteHistory {
    entries: NavigationTransaction[];
}

export interface NavigationEvent {
    type: 'navigate' | 'back' | 'forward';
    from: string;
    to: string;
}

export class NavigationService extends EventEmitter {
    private state: NavigationState = { currentRoute: '/', history: ['/'] };

    navigate(to: string): void {
        const from = this.state.currentRoute;
        this.state = {
            currentRoute: to,
            history: [...this.state.history, to],
        };
        this.emit('navigate', { type: 'navigate', from, to } satisfies NavigationEvent);
    }

    getState(): NavigationState {
        return { ...this.state, history: [...this.state.history] };
    }
}

let navigationServiceInstance: NavigationService | null = null;

export const getNavigationService = (): NavigationService => {
    if (!navigationServiceInstance) {
        navigationServiceInstance = new NavigationService();
    }
    return navigationServiceInstance;
};

export default NavigationService;
