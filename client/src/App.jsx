import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Demo from "./pages/Demo"
import BottomNav from "./components/BottomNav"
import "./index.css"

function App() {
  return (
      <Router>
            <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
                    <Routes>
                              <Route path="/" element={<Home />} />
                                        <Route path="/demo" element={<Demo />} />
                                                </Routes>
                                                        <BottomNav />
                                                              </div>
                                                                  </Router>
                                                                    )
                                                                    }

                                                                    export default App