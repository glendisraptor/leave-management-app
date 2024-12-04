import { create } from 'zustand';

interface LeaveRequest {
    id: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    type: 'vacation' | 'sick' | 'personal';
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

interface LeaveStore {
    requests: LeaveRequest[];
    addRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
    updateRequest: (id: string, status: LeaveRequest['status']) => void;
}

export const useLeaveStore = create<LeaveStore>((set) => ({
    requests: [],
    addRequest: (request) =>
        set((state) => ({
            requests: [
                ...state.requests,
                {
                    ...request,
                    id: crypto.randomUUID(),
                    status: 'pending',
                },
            ],
        })),
    updateRequest: (id, status) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.id === id ? { ...req, status } : req
            ),
        })),
}));
