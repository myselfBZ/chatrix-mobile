import { ChatConnector } from "@/components/ChatConnector";
import { useAuth } from "@/context/Auth";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayou() {
    const { isAuthenticated } = useAuth()

    if(!isAuthenticated) {
        return <Redirect href={"/login"}/>
    }

    return(
        <ChatConnector>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 10,
                }}
            >
                <Stack.Screen 
                    name="chat/[id]"
                />
                <Stack.Screen
                    options={{
                        animation: "slide_from_left"
                    }}
                    name="chat/chat"
                />
            </Stack>
        </ChatConnector>
    )
}