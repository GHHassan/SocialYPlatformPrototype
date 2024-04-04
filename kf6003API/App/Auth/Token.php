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
use App\{
    Database,
    Request,
    ClientError
};

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

    private function checkCredentials()
    {
        $sql = "SELECT userID, username, email, password_hash FROM users WHERE email = :email";
        $dbConn = new Database(DB_USER_PATH);
        if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
            throw new ClientError(401, "Username or password is missing");
        }
        if (empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW'])) {
            throw new ClientError(401, "Username or password is empty");
        }

        $sqlParams[":email"] = $_SERVER['PHP_AUTH_USER'];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        if (count($data) < 1) {
            throw new ClientError(401, "Username or password is incorrect");
        }
        if (count($data) > 1) {
            throw new ClientError(500, "Please contact your admin");
        }
        if (!password_verify($_SERVER['PHP_AUTH_PW'], $data[0]['password_hash'])) {
            throw new ClientError(401, "Username or password is incorrect");
        }
        $res['userID'] = $data[0]['userID'];
        $res['username'] = $data[0]['username'];
        $res['email'] = $data[0]['email'];
        return $res;
    }
}