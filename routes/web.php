<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Auth::routes();

Route::get('/authuserapi', [HomeController::class, 'authuser'])->name('authuser');
Route::post('/makepost', [HomeController::class, 'makepost'])->name('makepost');
Route::get('/postsapi', [HomeController::class, 'posts'])->name('posts');
Route::get('/postapi/{id}', [HomeController::class, 'post'])->name('post');
Route::post('/deletepost', [HomeController::class, 'deletepost'])->name('deletepost');
Route::post('/makecomment', [HomeController::class, 'makecomment'])->name('makecomment');
Route::get('/commentsapi/{id}', [HomeController::class, 'comments'])->name('comments');
Route::post('/deletecomment', [HomeController::class, 'deletecomment'])->name('deletecomment');
Route::get('/{path?}', [HomeController::class, 'index'])->name('home');
Route::get('/{path?}/{id}', [HomeController::class, 'index'])->name('home');
