import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "react-simple-wysiwyg";
import { toast } from "react-toastify";
//import { stripHtml } from "string-strip-html";
const BlogEdit = () => {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [imageId, setimageId] = useState("");
  const [blog, setblogdata] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  function onChange(e) {
    setHtml(e.target.value);
  }
  const fetchsingleblog = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/blogs/` + id);
    const response = await res.json();
    console.log(response);
    if (response.status == true && response.data != []) {
      setblogdata(response.data);
      console.log(response.data);
      toast.success(response.message);
      reset(response.data); //// Populate form fields with API data
      setHtml(response.data.description);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchsingleblog(id);
  }, [id]);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append("image", file);
    const res = await fetch("http://127.0.0.1:8000/api/save-temp-image", {
      method: "POST",

      body: formdata,
    });

    const response = await res.json();
    console.log(response);
    if (response.status == true) {
      toast.success(response.message);

      setimageId(response.image.id);
    } else {
      Object.values(response.errors).forEach((err) =>
        err.forEach((msg) => toast.error(msg))
      );
      //  toast.error(response.errors.image);
      e.target.value = null;
    }
  };
  const formSubmit = async (data) => {
    //  const htmldesc= stripHtml(html);
    // const newData = { ...data, "description": html.result, "image_id": imageId };
    const newData = { ...data, description: html, image_id: imageId };
    console.log(newData);
    const res = await fetch("http://127.0.0.1:8000/api/blogs/" + id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    const response = await res.json();
    console.log(response);
    /*{
    "status": false,
    "message": "Please fix the errors",
    "errors": {
        "title": [
            "The title field must be at least 10 characters."
        ],
        "author": [
            "The author field must be at least 3 characters."
        ]
    }
}*/
    if (response.status == true) {
      toast.success(response.message);
      navigate("/");
    } else {
      //toast.error(response.message);
      // Object.values(response.errors).forEach((errorArr) => {
      //   errorArr.forEach((msg) => toast.error(msg)); // Show each message
      // });

      //object=errors object.values=title,author which is array so now
      //in foreach each array[title,author].foreach and print msg
      Object.values(response.errors).forEach((err) => {
        err.forEach((msg) => toast.error(msg));
      });
    }
  };
  const showImage = (img) => {
    return img
      ? "http://127.0.0.1:8000/uploads/blogs/" + img
      : "https://placehold.co/640x480";
  };
  return (
    <div className="container">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Edit Blogs</h4>
        <a href="/" className="btn btn-dark">
          Back
        </a>
      </div>
      <div className="card border-0 shadow-lg">
        <form
          action=""
          method="post"
          onSubmit={handleSubmit(formSubmit)}
          encType="multipart/form-data"
        >
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name=""
                id=""
                {...register("title", { required: true })}
                className={`form-control ${errors.title && "is-invalid"}`}
                placeholder="Title"
              />
              {errors.title && (
                <p className="invalid-feedback">Title field is required</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Short Description</label>

              <textarea
                name=""
                {...register("shortDesc")}
                id=""
                cols="30"
                rows="10"
                className="form-control"
                placeholder="Short Description"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>

              {/* <textarea
              name=""
              id=""
              className="form-control"
              placeholder="Description"
              cols="30"
              rows="10"
            ></textarea> */}
              <Editor
                value={html}
                onChange={onChange}
                // {...register("description")}
                // containerProps={{ style: { resize: "vertical" } }}
                containerProps={{ style: { height: "700px" } }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                name=""
                id="image"
                className="form-control"
              />
              <div className="mt-2">
                {blog && (
                  <img
                    src={showImage(blog.image)}
                    alt={blog.title}
                    className="w-50"
                  />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                type="text"
                name=""
                id=""
                className={`form-control ${errors.author && "is-invalid"}`}
                placeholder="Author"
                {...register("author", { required: true })}
              />
              {errors.author && (
                <p className="invalid-feedback">Author field is required</p>
              )}
            </div>
            <button type="submit" className="btn btn-dark">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;
