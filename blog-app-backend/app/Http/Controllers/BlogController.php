<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\TempImage;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    //show all blogs
    public function index(Request $request)
    {
           $blogs = Blog::orderBy("created_at", "desc");
 if(!empty($request->keyword))
 {
   $blogs = Blog::where("title","like","%".$request->keyword."%");
 }
     $blogs=$blogs->get();
        return response()->json([
            "status" => true,
            "data" => $blogs,
            "message" => "Blogs fetched succesfully.",
        ]);
    }
    //show single blog
    public function show($id)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "status" => false,
                "message" => "Blog not found",
            ]);
        }

        $blog["date"] = \Carbon\Carbon::parse($blog->created_at)->format(
            "d M, Y"
        );
        return response()->json(["status" => true, "data" => $blog]);
    }

    //update a blog
    public function update($id, Request $request)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                "status" => false,
                "message" => "Blog not found",
            ]);
        }
        $validator = Validator::make($request->all(), [
            "title" => "required|min:10",
            "author" => "required|min:3",
        ]);
        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "message" => "Please fix the errors",
                "errors" => $validator->errors(),
            ]);
        }

        $blog->title = $request->title;
        $blog->description = $request->description;
        $blog->shortDesc = $request->shortDesc;
        $blog->author = $request->author;
        $blog->save();
        $tempimage = TempImage::find($request->image_id);
        if ($tempimage != null) {
            File::delete(public_path("uploads/blogs/" . $blog->image));
            $tempimageexplode = explode(".", $tempimage->name);
            $ext = last($tempimageexplode);
            $imageName = time() . "-" . $blog->id . "." . $ext;
            $blog->image = $imageName;
            $blog->save();

            $sourcePath = public_path("uploads/temp/" . $tempimage->name);
            $desPath = public_path("uploads/blogs/" . $imageName);
            File::copy($sourcePath, $desPath);
        }
        return response()->json([
            "status" => true,
            "message" => "Blog updated successfully",
            "data" => $blog,
        ]);
    }
    //create blog
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|min:10",
            "author" => "required|min:3",
        ]);
        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "message" => "Please fix the errors",
                "errors" => $validator->errors(),
            ]);
        }
        $blog = new Blog();
        $blog->title = $request->title;
        $blog->description = $request->description;
        $blog->shortDesc = $request->shortDesc;
        $blog->author = $request->author;
        // $blog->image=$request->image;
        $blog->save();

        $tempimage = TempImage::find($request->image_id);
        if ($tempimage != null) {
            $tempimageexplode = explode(".", $tempimage->name);
            $ext = last($tempimageexplode);
            $imageName = time() . "-" . $blog->id . "." . $ext;
            $blog->image = $imageName;
            $blog->save();

            $sourcePath = public_path("uploads/temp/" . $tempimage->name);
            $desPath = public_path("uploads/blogs/" . $imageName);
            File::copy($sourcePath, $desPath);
        }
        return response()->json([
            "status" => true,
            "message" => "Blog added successfully",
            "data" => $blog,
        ]);
    }

    //delete ablog
    public function destroy($id)
    {
        $blog=Blog::find($id);
          if ($blog == null) {
            return response()->json([
                "status" => false,
                "message" => "Blog not found",
            ]);
        }
File::delete(public_path('uploads/blogs/'.$blog->image));

        $blog->delete();
return response()->json(["status"=>true,"message"=>"Blog deleted successfully."]);
    }
}
