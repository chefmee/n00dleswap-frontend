import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)