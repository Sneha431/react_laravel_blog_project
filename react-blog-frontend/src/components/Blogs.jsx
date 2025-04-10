import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { toast } from "react-toastify";

const Blogs = () => {
  const [blogs, setblogs] = useState([]);
  const[keyword,setkeyword]=useState();
  const fetchblogs = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/blogs");
    const response = await res.json();

    console.log(response);

    if (response.status == true) {
      setblogs(response.data);

      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchblogs();
  }, []);
const handlesearch = async(e)=>{
  e.preventDefault();
     const res = await fetch(`http://127.0.0.1:8000/api/blogs/?keyword=` + keyword);
      const response = await res.json();
      console.log(response);
      if (response.status == true && response.data != []) {
        setblogs(response.data);
        console.log(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
}
const resetsearch = () =>{
  fetchblogs();
  setkeyword("");
}
  return (
    <div className="container">
      <div className="d-flex justify-content-center pt-5 mb-4">
        <form action="" method="post" onSubmit={(e) => handlesearch(e)}>
          <div className="d-flex">
            <input
              type="text"
              name=""
              id=""
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              className="form-control"
              placeholder="Search Blogs"
            />
            <button className="btn btn-success ms-2">Search</button>
            <button
              className="btn btn-dark ms-2"
            
              onClick={()=>resetsearch()}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <a href="/create" className="btn btn-dark">
          Create
        </a>
      </div>
      <div className="row">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              blogs={blogs}
              setblogs={setblogs}
              blog={blog}
              key={blog.id}
            />
          ))
        ) : (
          <p>No blogs added</p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
