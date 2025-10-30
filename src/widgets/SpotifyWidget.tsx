import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

export const SpotifyWidget = () => {
    return (
        <>
            <div id="resizable">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel>One</ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>Two</ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </>
    );
};