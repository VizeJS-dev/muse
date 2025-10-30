import './App.css'
import {SpotifyWidget} from "@/widgets/SpotifyWidget";
function App() {

  return (
    <>
        <div className="flex h-screen w-screen items-center justify-center bg-primary">
            <SpotifyWidget/>
        </div>
    </>
  )
}

export default App
