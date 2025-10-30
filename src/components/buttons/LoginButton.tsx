import {Button} from "@/components/ui/button";
import {loginWithSpotify} from "@/services/spotify-auth.ts";

export const LoginButton = () => {
    return (
        <>
            <Button onClick={loginWithSpotify} size="sm" variant="outline">
                Login
            </Button>
        </>
    );
};