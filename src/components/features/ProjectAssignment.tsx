import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { Client } from "@microsoft/microsoft-graph-client";
import LoaderCard from '../ui/loader-card';
import ErrorCard from '../ui/error-card';

interface Project {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'planned';
}

interface Assignment {
    userId: string;
    projectId: string;
    role: string;
}

interface UserDetails {
    id: string;
    displayName: string;
    email: string;
}

interface Workspace {
    id: string;
    name: string;
    description?: string;
}

export const ProjectAssignment = () => {
    const { getToken } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [users, setUsers] = useState<UserDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        const fetchData = async () => {

            if (fetchedRef.current) return;
            fetchedRef.current = true;

            const { accessToken, errorMessage } = await getToken();
            if (!accessToken) {
                console.error('No access token available', errorMessage);
                setError("Access token not available");
                setLoading(false);
                return;
            }

            const client = Client.init({
                authProvider: (done) => done(null, accessToken),
            });

            try {
                // Fetch users from your organization
                const usersResponse = await client.api('/users')
                    .select('id,displayName,mail')
                    .get();
                setUsers(usersResponse.value || []); // Ensure we always set an array

                // If you're using Microsoft Loop, you can fetch workspaces
                // Note: This requires appropriate permissions
                try {
                    const workspaces = await client.api('/me/followedSites')
                        .get();

                    // Transform workspaces into projects
                    const projectsList = workspaces.value.map((workspace: Workspace) => ({
                        id: workspace.id,
                        title: workspace.name,
                        description: workspace.description || '',
                        status: 'active',
                    }));

                    setProjects(projectsList);
                } catch (workspaceError) {
                    setError(workspaceError instanceof Error ? workspaceError.message : 'Error fetching workspaces.');
                    console.error('Error fetching workspaces:', workspaceError);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error fetching data.');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getToken]);

    const handleAssignment = async (userId: string, projectId: string, role: string) => {
        // Add assignment logic here
        setAssignments((prev) => [...prev, { userId, projectId, role }]);

        const { accessToken } = await getToken();
        if (!accessToken) return;

        const client = Client.init({
            authProvider: (done) => done(null, accessToken),
        });

        try {
            // Add user to workspace/project
            await client.api(`/sites/${projectId}/permissions`)
                .post({
                    roles: [role],
                    grantedToIdentities: [{
                        user: {
                            id: userId,
                        },
                    }],
                });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error assigning user to project.');
            console.error('Error assigning user to project:', error);
        }
    };

    if (loading) {
        return <LoaderCard text="Loading your projects..." />;
    }

    if (error) {
        return (
            <ErrorCard
                title="Project Error"
                message={error}
                onClose={() => setError(null)}
            />
        );
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Assignments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="p-4">
                            <h3 className="font-medium">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>

                            <div className="mt-4 space-y-2">
                                <Select
                                    onValueChange={(userId) => handleAssignment(userId, project.id, 'Member')}
                                >
                                    <option value="">Assign team member</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.displayName}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium">Current Team</h4>
                                {assignments
                                    .filter((a) => a.projectId === project.id)
                                    .map((assignment) => {
                                        const user = users.find((u) => u.id === assignment.userId);
                                        return (
                                            <div key={`${assignment.userId}-${project.id}`} className="text-sm">
                                                {user?.displayName} - {assignment.role}
                                            </div>
                                        );
                                    })}
                            </div>
                        </Card>
                    ))}
                    {projects.length === 0 && !loading && !error && (
                        <p className="text-center text-muted-foreground">
                            No projects found
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
