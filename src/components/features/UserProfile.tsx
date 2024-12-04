import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { Client } from "@microsoft/microsoft-graph-client";
import ErrorCard from '../ui/error-card';
import LoaderCard from '../ui/loader-card';

interface UserProfileData {
    displayName: string;
    jobTitle: string;
    mail: string;
    department: string;
    photoUrl?: string;
}

export const UserProfile = () => {
    const { getToken } = useAuth();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        const fetchProfile = async () => {

            if (fetchedRef.current) return;
            fetchedRef.current = true;

            const { accessToken, errorMessage } = await getToken();
            if (!accessToken) {
                setLoading(false);
                console.error('No access token available', errorMessage);
                setError("Access token not available");
                return;
            }

            const client = Client.init({
                authProvider: (done) => done(null, accessToken),
            });

            try {
                const user = await client.api('/me')
                    .select('displayName,jobTitle,mail,department')
                    .get();

                // Fetch user photo
                try {
                    const photo = await client.api('/me/photo/$value').get();
                    user.photoUrl = URL.createObjectURL(photo);
                } catch (e) {
                    console.log('No profile photo available', e);
                }

                setProfile(user);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError("Error fetching profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [getToken]);

    if (loading) {
        return <LoaderCard text="Loading your profile..." />;
    }

    if (error) {
        return (
            <ErrorCard
                title="Profile Error"
                message={error}
                onClose={() => setError(null)}
            />
        );
    }

    // If no profile data, show the 'No Profile Found' card
    if (!profile) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="flex items-center space-y-4">
                    <h2 className="text-2xl font-bold">No Profile Found</h2>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-center text-muted-foreground">No profile data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="flex items-center space-y-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.photoUrl || '/default-avatar.png'} alt="User photo" />
                    <AvatarFallback>
                        {profile.displayName?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{profile.displayName}</h2>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Job Title:</span>
                    <span>{profile.jobTitle}</span>

                    <span className="text-muted-foreground">Email:</span>
                    <span>{profile.mail}</span>

                    <span className="text-muted-foreground">Department:</span>
                    <span>{profile.department}</span>
                </div>
            </CardContent>
        </Card>
    );
};
