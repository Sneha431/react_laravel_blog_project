<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\TempImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("blogs",[BlogController::class,"index"]);
Route::put("blogs/{id}",[BlogController::class,"update"]);
Route::post("blogs",[BlogController::class,"store"]);
Route::get("blogs/{id}",[BlogController::class,"show"]);
Route::post("save-temp-image",[TempImageController::class,"store"]);
Route::delete("blogs/{id}",[BlogController::class,"destroy"]);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
