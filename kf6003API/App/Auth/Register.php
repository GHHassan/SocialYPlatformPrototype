<?php

namespace App\Auth;

/**
 * Register class
 * 
 * Responsible for handling user registration and user data manipulation operations.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 * @author Sam Easton <w21038401>
 */

use App\{
    EndpointController\Endpoint,
    ClientError,
    Database,
    Request
};

use Firebase\JWT\JWT;

class Register extends Endpoint
{
    private $sql;
    private $sqlParams;
    private $password;
    private $email;
    private $username;
    private $role;
    private $db;
    private $userID;
    private $data;
    private $allowedMethods = ['OPTION', 'POST', 'PATCH', 'PUT', 'GET', 'DELETE'];

    /**
     * Constructor for the Register class.
     * 
     * It initializes the database connection and delegates the request to the appropriate method based on the HTTP method.
     *
     * @param array $data Initial data to set, default is an empty array with a message key.
     */
    public function __construct($data = ["message" => []])
    {
        $this->db = new Database(DB_USER_PATH);
        $this->routeRequest();
        parent::__construct($this->data);
    }

    /**
     * Routes the incoming request to the appropriate method based on the HTTP method.
     */
    private function routeRequest()
    {
        $method = Request::method();
        switch ($method) {
            case "POST":
                $this->handlePostRequest();
                break;
            case "PUT":
                $this->setRole();
                break;
            case "PATCH":
                $this->updateUser();
                break;
            case "GET":
                $this->getUser();
                break;
            case "DELETE":
                $this->deleteUser();
                break;
            default:
                $this->data = ["message" => "Invalid request method"];
                break;
        }
    }


    /** handle Clerk Requests */

    private function handlePostRequest()
    {
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
        if (!isset($data['type']) || empty($data['type'])) {
            $this->registerUser($data);
            return;
        } //should be fixed
        switch ($data['type']) {
            case "user.created":
                $this->registerUser($data);
                break;
            case "user.updated":
                $this->updateUser();
                break;
            case "user.deleted":
                $this->deleteUser();
                break;
            default:
                throw new ClientError(422, 'Invalid SSO event type');
        }
    }

    /**
     * Registers/Create a new user.
     */
    private function registerUser($data)
    {
        $this->initialiseSQLAndParams();
        $sql = "SELECT email FROM users WHERE email = :email";
        $sqlParams = [
            ':email' => $this->email
        ];

        if (count($this->db->countRows($sql, $sqlParams)) > 0) {
            $this->data = ["message" => "User already exists"];
            return;
        }
        $data = $this->db->executeSql($this->sql, $this->sqlParams);
        ($data['lastInsertId']) > 0 ? $data['message'] = 'success' : $data['message'] = 'failed';
        $this->data = $data;
    }

    /**
     * Updates the role of an existing user.
     */
    private function setRole()
    {
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
        if (!isset($data['userID'])) {
            throw new ClientError(400, "userID and role are required");
        }
        $sql = "UPDATE users set role = :role WHERE userID = :userID";
        $sqlParams = [":role" => $data['role'], ":userID" => $data['userID']];
        $result = $this->db->executeSql($sql, $sqlParams);
        $result['rowCount'] > 0 ? $result['message'] = 'success' : $result['message'] = 'user not found';
        $this->data = $result;
    }

    /**
     * Updates the details of an existing user.
     */
    private function updateUser()
    {
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
        $this->initialiseSQLAndParams();
        $this->db->executeSql($this->sql, $this->sqlParams);

        // mint a new jwt for the user
        $this->sql = "select username, email, password_hash FROM users where userID = :userID";
        $this->sqlParams = [":userID" => $this->userID];
        $result = $this->db->executeSql($this->sql, $this->sqlParams);        
        $this->data = $result;
    }

    /**
     * Retrieves the details of a specific user.
     */
    private function getUser()
    {
        if (!isset($_GET['userID'])) {
            throw new ClientError(400, "userID is required");
        }
        $userID = $_GET['userID'];
        $this->sql = "select userID, username, email FROM users where userID = :userID";
        $this->sqlParams = [":userID" => $userID];
        $result = $this->db->executeSql($this->sql, $this->sqlParams);
        count($result) > 0 ? $result['message'] = 'success' : $result['message'] = 'user not found';
        $this->data = $result;
    }

    /**
     * Deletes a user from the database.
     */
    private function deleteUser()
    {
        if (!isset($_GET['userID'])) {
            throw new ClientError(400, "userID is required");
        }
        $userID = $_GET['userID'];
        $this->sql = "delete from users where userID = :userID";
        $this->sqlParams = [":userID" => $userID];
        $result = $this->db->executeSql($this->sql, $this->sqlParams);
        $result['rowCount'] > 0 ? $result['message'] = 'success' : $result['message'] = 'user not found';
        $this->data = $result;
    }

    /**
     * Checks if the provided email is valid.
     *
     * @param string $email The email to validate.
     * @return bool Returns true if the email is valid, otherwise false.
     */
    function isValidEmail($email)
    {
        $pattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';

        if (preg_match($pattern, $email)) {
            return true;
        } else {
            throw new ClientError(400, "Invalid email");
        }
    }

    /**
     * Generates a unique user ID.
     *
     * @return string Returns a unique user ID.
     */
    private function generateUserID()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $userID = '';
        for ($i = 0; $i < 10; $i++) {
            $userID .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $userID;
    }

    /**
     * Generates a JWT for a user.
     *
     * @param array $user User data to encode in the JWT.
     * @return string Returns the generated JWT.
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
        $jwt = JWT::encode($payload, $secretKey, 'HS256');
        return $jwt;
    }

    /**
     * Initializes the SQL statement and parameters for inserting a new user into the database.
     *
     * This method prepares the SQL statement and parameters required to insert a new user
     * into the database, ensuring that all necessary data is present and valid before
     * proceeding with the insertion.
     */
    protected function initialiseSQLAndParams()
    {
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
        if (!isset($data['type']) || empty($data['type'])) {
            if (isset($data['username']) && isset($data['email']) && isset($data['password'])) {
                if ($this->isValidEmail($data['email'])) {
                    isset($data['userID']) ? $this->userID = $data['userID'] : $this->userID = $this->generateUserID();
                    $this->username = ucwords($this->sanitiseString($data['username']));
                    $this->email = strtolower($this->sanitiseEmail($data['email']));
                    $this->password = password_hash($data['password'], PASSWORD_DEFAULT);
                    $this->role = isset($data['role']) ? $data['role'] : 'user';
                    $this->sql = "INSERT INTO users (userID, username, email, password_hash, role) VALUES (:userID, :username, :email, :password, :role)";
                } else {
                    throw new ClientError(422, 'Invalid email format');
                }
            } else {
                throw new ClientError(422, 'Missing required data');
            }
        } else if (!empty($data['type'])) {
            switch ($data['type']) {
                case "user.created":
                    $this->sql = "INSERT INTO users (userID, username, email, password_hash, role) VALUES (:userID, :username, :email, :password, :role)";
                    break;
                case "user.updated":
                    $this->sql = "UPDATE users set username = :username, email = :email, password_hash = :password, role = :role WHERE userID = :userID";
                    break;
                case "user.deleted":
                    $this->sql = "DELETE FROM users WHERE userID = :userID";
                    break;
                default:
                    throw new ClientError(422, 'Invalid SSO event type');
            }
            $userData = $data['data'];
            $this->userID = $userData['id'];
            $this->username = isset($userData['username']) ? $userData['username'] : (isset($userData['firstname']) && isset($userData['lastname']) ? ucwords($userData['firstname'] . ' ' . $userData['lastname']) : 'Unknown');
            $this->email = $userData['email_addresses'][0]['email_address'];
            $this->password = "SSO";
        }

        $this->sqlParams = [
            ":userID" => $this->userID,
            ':username' => $this->username,
            ':email' => strtolower($this->sanitiseEmail($this->email)),
            ':password' => $this->password,
            ':role' => $this->role
        ];
    }
}
