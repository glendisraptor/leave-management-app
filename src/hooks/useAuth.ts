import { graphScopes } from "@/config/authConfig";
import { useMsal } from "@azure/msal-react";

export const useAuth = () => {
    const { instance, accounts } = useMsal();
    const account = accounts[0];

    const login = async () => {
        try {
            await instance.loginPopup({
                scopes: graphScopes,
                prompt: "consent"
            });
        } catch (error) {
            console.error("Login failed:", error);
            if (error instanceof Error) {
                return {
                    error,
                    errorMessage: error.message || "Failed to log in. Please try again.",
                    accessToken: null
                };
            } else {
                return {
                    error,
                    errorMessage: "Failed to log in. Please try again.",
                    accessToken: null
                };
            }
        }
    };

    const logout = () => {
        instance.logout();
    };

    const getToken = async () => {
        try {
            const response = await instance.acquireTokenSilent({
                scopes: graphScopes,
                account: account,
            });
            return {
                accessToken: response.accessToken,
                error: null
            }
        } catch (error) {
            console.error("Token acquisition failed:", error);
            if (error instanceof Error) {
                return {
                    error,
                    errorMessage: error.message || "Failed to acquire token. Please try logging in again.",
                    accessToken: null
                }
            } else {
                return {
                    error,
                    errorMessage: "Failed to acquire token. Please try logging in again.",
                    accessToken: null
                }
            }
        }
    }

    return {
        isAuthenticated: !!account,
        account,
        login,
        logout,
        getToken,
    };
};