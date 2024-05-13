<?php

namespace App\Auth;

/**
 * Ssouser
 * 
 * This class is listening to the SSO events, it 
 * listens to the user.created, user.updated and user.deleted
 * events and updates the users table in the database accordingly.
 * 
 * The url of this endpoint is passed to the Clerk API as a webhook.
 * and any event that happens in the SSO is sent to this endpoint.
 * and the data is updated in the users table in the database accordingly.
 * 
 * @author Hassan Hassani <w20017074@northumbria.ac.uk>
 * @package App\EndpointController
 * 
 */

use App\{
    Requesthandler,
    ClientError,
    EndpointController\Endpoint,
    Request
};

class Ssouser extends Endpoint
{
    private $allowedParams = ['GET', 'POST'];
    private $sqlParams = [];
    private $data = [];
    private $db;

    public function __construct()
    {
        $this->db = new \App\Database(DB_USER_PATH);
        $this->performActio();
        parent::__construct($this->data);
    }

    public function performActio()
    {
        $this->checkAllowedMethod(Request::method(), $this->allowedParams);

        switch (Request::method()) {
            case 'GET':
                $this->data = $this->getRole();
                break;
            case 'POST':
                $this->data = $this->recordData();
                break;
            default:
                throw new ClientError(405, 'Method Not Allowed');
        }
    }

    function getRole()
    {
        $userID = $_GET['userID'];
        $sql = "SELECT role FROM users WHERE userID = :userID";
        $this->sqlParams = [
            ':userID' => $userID,
        ];
        $data = $this->db->executeSql($sql, $this->sqlParams);
        if (count($data) > 0) {
            return $data;
        } else {
            return $data['role'] = 'Unassigned';
            
        }
    }

    public function getData()
    {
        $data = (new Requesthandler())->getData();
        return $data;
    }

    private function recordData()
    {
        $requestData = $this->getData();
        switch ($requestData['type']) {
            case "user.created":
                $username = isset($requestData['username']) ? $requestData['username'] : isset($requestData['data']['first_name']) . isset($requestData['data']['last_name']);
                return $this->db->executeSql(
                    "INSERT INTO users (userID, username, email, password_hash) VALUES (:userID, :username, :email, :password_hash)",
                    [
                        ':userID' => $requestData['data']['id'],
                        ':username' => $username,
                        ':email' => $requestData['data']['email_addresses'][0]['email_address'],
                        ':password_hash' => 'SSO',
                    ]
                );
                break;
            case "user.updated":
                return $this->db->executeSql(
                    "UPDATE users SET email = :email, username = :username, password_hash = :password_hash WHERE userID = :userID",
                    [
                        ':userID' => $requestData['data']['primary_email_address_id'],
                        ':username' => $requestData['data']['first_name'] . $requestData['data']['last_name'],
                        ':email' => $requestData['data']['email_addresses'][0]['email_address'],
                        ':password_hash' => 'SSO',
                    ]
                );
                break;
            case "user.deleted":
                return $this->db->executeSql(
                    "DELETE FROM users WHERE userID = :userID",
                    [':userID' => $requestData['data']['id']]
                );
                break;
            default:
                throw new ClientError(422, 'Invalid SSO event type');
        }
    }

    /**
     * Initializes the SQL statement and parameters for inserting a new user into the database.
     *
     * This method prepares the SQL statement and parameters required to insert a new user
     * into the database, ensuring that all necessary data is present and valid before
     * proceeding with the insertion.
     */

    protected function initialiseSQL()
    {
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
        if (isset($data['username']) || isset($data['email']) || isset($data['password'])) {
            if ($this->isValidEmail($data['email'])) {
                isset($data['userID']) ? $this->userID = $data['userID'] : $this->userID = $this->generateUserID();
                $this->name = ucwords($this->sanitiseString($data['username']));
                $this->email = strtolower($this->sanitiseEmail($data['email']));
                $this->password = password_hash($data['password'], PASSWORD_DEFAULT);
            } else {
                throw new ClientError(422, 'Invalid email format');
            }
        } else {
            throw new ClientError(422, 'Missing required data');
        }

        $this->sql = "INSERT INTO users (userID, username, email, password_hash) VALUES (:userID, :username, :email, :password)";
        $this->sqlParams = [
            ":userID" => $this->userID,
            ':username' => $this->name,
            ':email' => $this->email,
            ':password' => $this->password
        ];
    }
}