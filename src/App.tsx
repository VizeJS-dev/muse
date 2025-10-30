import './App.css'
import {ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable.tsx";

function App() {

  return (
    <>
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>
        </div>
    </>
  )
}

export default App
