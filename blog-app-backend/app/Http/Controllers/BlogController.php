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
    public function index()
    {

    }

    //create blog
    public function store(Request $request){
       $validator= Validator::make($request->all(),[
            "title"=>"required|min:10",
            "author"=>"required|min:3"
       ]);
if($validator->fails()){
return response()->json(
    ["status"=>false,
    "message"=>"Please fix the errors",
"errors"=>$validator->errors()
]);
}
$blog = new Blog();
$blog->title=$request->title;
$blog->description=$request->description;
$blog->shortDesc=$request->shortDesc;
$blog->author=$request->author;
// $blog->image=$request->image;
$blog->save();

$tempimage = TempImage::find($request->image_id);
if($tempimage!=null){
    $tempimageexplode=explode(".",$tempimage->name);
    $ext=last($tempimageexplode);
    $imageName=time()."-".$blog->id.".".$ext;
    $blog->image = $imageName;
    $blog->save();

 $sourcePath = public_path('uploads/temp/' . $tempimage->name);
$desPath = public_path('uploads/blogs/' . $imageName);
    File::copy($sourcePath, $desPath);
}
return response()->json(
    ["status"=>true,
    "message"=>"Blog added successfully",
"data"=>$blog
]);

}
    

    //show single blog
    public function show($id){
    }

    //update a blog
    public function update(Request $request, $id){
    }
//delete ablog
    public function destroy($id){
    
    }
}
