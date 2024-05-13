<?php

namespace App\Auth;


/**
 * The Token class is responsible for handling user authentication and token generation.
 * 
 * It validates user credentials and generates a JWT token that the user can use to access
 * restricted and personalized materials. The token is valid for 1 hour.
 * 
 * @package App\Auth
 * @return JWT token if the user provides valid credentials
 * 
 * @uses Firebase\JWT\JWT
 * @uses App\Request
 * 
 * @author John Rooksby <john.rooksby@northumbria.ac.uk>
 * @author Ghulam Hassan Hassani <w20017074>
 * @author Sam Easton <w21038401>
 */

use Firebase\JWT\JWT;
use App\Request;

class Token extends \App\EndpointController\Endpoint
{
    private $allowedMethods = ['GET', 'POST'];
    private $data = [];

    /**
     * Constructs the Token object and initiates the authentication and token generation process.
     */
    public function __construct()
    {
        $this->checkAllowedMethod(Request::method(), $this->allowedMethods);
        $user = $this->checkCredentials();
        if (!$user) {
            // Handle the case where credentials are invalid or missing.
            $this->data['message'] = 'Invalid credentials';
            parent::__construct($this->data);
            return;
        }

        $this->data['token'] = $this->generateJWT($user);
        $this->data['message'] = 'success';
        parent::__construct($this->data);
    }

    /**
     * Generates a JWT token for the authenticated user.
     * 
     * @param array $user The user's information, including userID, username, email, role, etc.
     * @return string The generated JWT token.
     */
    private function generateJWT($user)
    {
        $secretKey = SECRET;
        $iat = time();
        $iss = $_SERVER['HTTP_HOST'];
        $payload = [
            'sub' => $user['userID'],
            'username' => $user['username'],
            'email' => $user['email'],
            'iat' => $iat,
            'exp' => $iat + (3600 * 6),
            'iss' => $iss
        ];
        return JWT::encode($payload, $secretKey, 'HS256');
    }
}