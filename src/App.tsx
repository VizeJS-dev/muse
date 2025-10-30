import './App.css'
import {SpotifyWidget} from "@/components/widgets/SpotifyWidget/SpotifyWidget.tsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {SpotifyCallback} from "@/components/callback/SpotifyCallback.tsx";
import {ThemeToggle} from "@/components/ThemeToggle.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="flex h-screen w-screen items-center justify-center bg-primary">
                        <div className="absolute top-4 right-4 z-50">
                            <ThemeToggle />
                        </div>
                        {/*<LoginButton></LoginButton>*/}
                        <SpotifyWidget/>
                    </div>
                }/>
                <Route path="/callback" element={<SpotifyCallback/>}/>
            </Routes>
        </Router>
    )
}

export default App