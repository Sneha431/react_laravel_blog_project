import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import { toast } from "react-toastify";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setblogdata] = useState(null);
  const fetchsingleblog = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/blogs/` + id);
    const response = await res.json();
    console.log(response);
    if (response.status == true && response.data != []) {
      setblogdata(response.data);
      console.log(response.data);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  useEffect(() => {
    fetchsingleblog(id);
  }, [id]);

  const showImage = (img) => {
    return img
      ? "http://127.0.0.1:8000/uploads/blogs/" + img
      : "https://placehold.co/640x480";
  };
  if (!blog) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh", // full height of the viewport
        }}
      >
        <ClockLoader />
        <div>
          <h1 style={{ marginTop: "10px" }}>
            Data loading....Please wait for sometime.
          </h1>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      {blog && (
        <>
          <div className="d-flex justify-content-between pt-5 mb-4">
            <h2>{blog.title}</h2>
            <div>
              <a href="/" className="btn btn-dark">
                Go back to blogs
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p>
                by <strong>{blog.author}</strong> on {blog.date}
              </p>

              {blog.image && (
                <img
                  src={showImage(blog.image)}
                  alt={blog.title}
                  className="w-50"
                />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: blog.description }}
                className="mt-5"
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogDetails;
