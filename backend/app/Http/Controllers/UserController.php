<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Contracts\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors(), 422]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWtAuth::fromUser($user);
        return response()->json(['message' => 'User registered successfully', 
            'user' => $user,
            'token' => $token,
        ], 201);    
    }

    public function login(Request $request)
    {
        $request = Validate([ 
            'email' => 'required|email',
            'password' => 'required|min:8|max:15',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json(['errors'=>'Invalid Email'], 401);
        }
        elseif (Hash::check($request->password, $user->password)) {
            return response()->json(['errors'=>'Invalid credentials'], 401);
        }

        $token = JWtAuth::fromUser($user);

        return response()->json(['message' => 'Login successfully', 
            'user' => $user->makeHidden(['password']),
            'token' => $token,
        ], 201);    
    }

    public function dashboard(request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } 
        catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token Invalid'], 401);
        }
        catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token Expired'], 401);
        }
        catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token absent'], 401);
        }

        return response()->json(['message' => 'Login successfully', 
            'user' => $user,
            'message' => 'Welcome to your dashboard',
        ], 201); 

    }
    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            if(!$token) {
                return response()->json(['error' => 'Token not provided'], 401);
            }

            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Logout successfully'], 401);
            }
        catch (\Tymon\JWTAuth\Exceptions\TokenException $e) {
            return response()->json(['error' => 'Token Invalid'], 401);
        }
        


    }

}