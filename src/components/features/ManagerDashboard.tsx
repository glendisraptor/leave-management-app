import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLeaveStore } from '@/store/leaveStore';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Client } from "@microsoft/microsoft-graph-client";
import ErrorCard from '../ui/error-card';
import LoaderCard from '../ui/loader-card';

interface UserDetails {
    id: string;
    displayName: string;
    email: string;
}

export const ManagerDashboard = () => {
    const { getToken } = useAuth();
    const requests = useLeaveStore((state) => state.requests);
    const updateRequest = useLeaveStore((state) => state.updateRequest);
    const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        const fetchUserDetails = async () => {

            if (fetchedRef.current) return;
            fetchedRef.current = true;

            const { accessToken, errorMessage } = await getToken();
            if (!accessToken) {
                console.error('No access token available', errorMessage);
                setError("Access token not available");
                setLoading(false);
                return;
            };

            const client = Client.init({
                authProvider: (done) => done(null, accessToken),
            });

            const userIds = [...new Set(requests.map(req => req.userId))];

            for (const userId of userIds) {
                try {
                    const user = await client.api(`/users/${userId}`)
                        .select('id,displayName,mail')
                        .get();

                    setUserDetails(prev => ({
                        ...prev,
                        [userId]: {
                            id: user.id,
                            displayName: user.displayName,
                            email: user.mail,
                        },
                    }));
                } catch (error) {
                    console.error(`Error fetching user ${userId}:`, error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [requests, getToken]);

    const handleApproval = async (requestId: string, approved: boolean) => {
        const status = approved ? 'approved' : 'rejected';
        updateRequest(requestId, status);

        // Update calendar event if approved
        if (approved) {
            const request = requests.find(req => req.id === requestId);
            if (request) {
                // TODO Add calendar event logic here
            }
        }
    };

    const pendingRequests = requests.filter(req => req.status === 'pending');

    if (loading) {
        return <LoaderCard text="Loading your leave requests..." />;
    }

    if (error) {
        return (
            <ErrorCard
                title="Leave Request Error"
                message={error}
                onClose={() => setError(null)}
            />
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave Requests Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Show requests */}
                    {!loading && !error && pendingRequests.length > 0 && pendingRequests.map((request) => (
                        <Card key={request.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">
                                        {userDetails[request.userId]?.displayName || 'Loading...'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(request.startDate), 'PPP')} - {format(new Date(request.endDate), 'PPP')}
                                    </p>
                                    <Badge className="mt-2">{request.type}</Badge>
                                    {request.notes && (
                                        <p className="mt-2 text-sm">{request.notes}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => handleApproval(request.id, true)}
                                        variant="default"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleApproval(request.id, false)}
                                        variant="destructive"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {pendingRequests.length === 0 && !loading && !error && (
                        <p className="text-center text-muted-foreground">
                            No pending leave requests
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
