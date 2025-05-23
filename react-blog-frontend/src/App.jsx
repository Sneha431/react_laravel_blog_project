
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import CreateBlogs from './components/CreateBlogs';
  import { ToastContainer} from "react-toastify";
import BlogDetails from './components/BlogDetails';
import BlogEdit from './components/BlogEdit';
function App() {


  return (
    <>
      <div className="bg-dark text-center py-2 shadow-lg">
        <h1 className="text-white ">React and Laravel Blog App</h1>
      </div>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/create" element={<CreateBlogs />} />
        <Route path="/blog/details/:id" element={<BlogDetails />} />
        <Route path="/blog/edit/:id" element={<BlogEdit />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App
