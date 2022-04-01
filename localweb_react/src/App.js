import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login'
import Home from './components/home'
import Admin from './components/admin';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from './includes/sidebar';
import Products from './components/Products';

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/products' element={<Products />} />
      </Routes>
    </Router>
  );
}
export default App;
