<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function authuser()
    {
        return User::where('id', Auth::user()->id)->get();
    }

    public function makepost(Request $req)
    {
        if (Auth::user()->role == 'admin') {
            $validator = Validator::make($req->all(), [
                'header' => 'required',
                'description' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $header = htmlspecialchars($req->header);
            $description = nl2br(htmlspecialchars($req->description));
            $postdata = array('header' => $header, 'description' => $description);
            Post::insert($postdata);
        }
    }

    public function posts()
    {
        return Post::orderBy('id', 'desc')->get();
    }

    public function post()
    {
        $id = request('id');
        return Post::where('id', $id)->get();
    }

    public function deletepost(Request $req)
    {
        if (Auth::user()->role == 'admin') {
            $req->validate([
                'id' => 'required'
            ]);

            Post::where('id', $req->id)->delete();
            Comment::where('postid', $req->id)->delete();
        }
    }

    public function makecomment(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'postid' => 'required',
            'comment' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $commentbyid = Auth::user()->id;
        $commentby = Auth::user()->name . ' ' . Auth::user()->surname;
        $postid = $req->postid;
        $comment = nl2br(htmlspecialchars($req->comment));
        $commentdata = array('commentbyid' => $commentbyid, 'commentby' => $commentby, 'postid' => $postid, 'comment' => $comment);
        Comment::insert($commentdata);
    }

    public function comments()
    {
        $id = request("id");
        return Comment::where("postid", $id)->orderBy("id", "desc")->get();
    }

    public function deletecomment(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Comment::where("id", $req->id)->delete();
    }
}
