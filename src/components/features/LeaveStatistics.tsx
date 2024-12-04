import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLeaveStore } from '@/store/leaveStore';
import { differenceInDays } from 'date-fns';

interface LeaveQuota {
    vacation: number;
    sick: number;
    personal: number;
}

const DEFAULT_QUOTA: LeaveQuota = {
    vacation: 20,
    sick: 10,
    personal: 5,
};

export const LeaveStatistics = () => {
    const requests = useLeaveStore((state) => state.requests);
    const [usedDays, setUsedDays] = useState<LeaveQuota>({
        vacation: 0,
        sick: 0,
        personal: 0,
    });

    useEffect(() => {
        const approved = requests.filter(req => req.status === 'approved');

        const calculateUsedDays = approved.reduce((acc, req) => {
            const days = differenceInDays(new Date(req.endDate), new Date(req.startDate));
            acc[req.type] += days;
            return acc;
        }, {
            vacation: 0,
            sick: 0,
            personal: 0,
        });

        setUsedDays(calculateUsedDays);
    }, [requests]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Leave Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Vacation Leave</span>
                            <span>{usedDays.vacation}/{DEFAULT_QUOTA.vacation} days</span>
                        </div>
                        <Progress value={(usedDays.vacation / DEFAULT_QUOTA.vacation) * 100} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Sick Leave</span>
                            <span>{usedDays.sick}/{DEFAULT_QUOTA.sick} days</span>
                        </div>
                        <Progress value={(usedDays.sick / DEFAULT_QUOTA.sick) * 100} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Personal Leave</span>
                            <span>{usedDays.personal}/{DEFAULT_QUOTA.personal} days</span>
                        </div>
                        <Progress value={(usedDays.personal / DEFAULT_QUOTA.personal) * 100} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};