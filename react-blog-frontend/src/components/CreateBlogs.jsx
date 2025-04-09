import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Editor from "react-simple-wysiwyg";
import { toast } from 'react-toastify';
import { stripHtml } from "string-strip-html";
const CreateBlogs = () => {
  const [html, setHtml] = useState('');
    const [imageId, setimageId] = useState("");
  const navigate = useNavigate();
  
   const {
     register,
     handleSubmit,
   
     formState: { errors },
   } = useForm();
  function onChange(e) {
    setHtml(e.target.value);
  }

  const handleFileChange = async(e) =>{
  
const file = e.target.files[0];
console.log(file);
const formdata = new FormData();
formdata.append("image",file);
const res = await fetch("http://127.0.0.1:8000/api/save-temp-image", {
  method: "POST",
 
  body: formdata
});

const response = await res.json();
console.log(response);
if(response.status==true)
{
  toast.success(response.message);

   setimageId(response.image.id);

}
else{
 
  Object.values(response.errors).forEach((err) =>
    err.forEach((msg) => toast.error(msg))
  );
  //  toast.error(response.errors.image);
   e.target.value=null;
}
  }
  const formSubmit = async (data) =>{

    const htmldesc= stripHtml(html);
    const newData = { ...data, "description": htmldesc.result,"image_id":imageId};
 console.log(newData);
const res = await fetch("http://127.0.0.1:8000/api/blogs",
{
  method:"POST",
  headers:{
    'Content-type':'application/json'
  },
  body:JSON.stringify(newData)
}

);

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

  }
  return (
    <div className="container">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Create Blogs</h4>
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
                containerProps={{ style: { height: "400px" } }}
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlogs