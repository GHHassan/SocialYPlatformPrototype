<?php

namespace App\EndpointController;

/**
 * Class Post
 * 
 * This class is responsible for handling the requests to the post endpoint.
 * It can handle GET, POST, PUT and DELETE requests.
 * Parameters: should be passed as JSON in the body of the HTTP request
 * 
 * HTTP Request Methods:
 * GET: Get a post by postID, userID and visibility both or no parameters for all posts
 * POST: Create a new post Requires userID, username, and at least one of the optional parameters
 *  (textContent, location, photoPath, videoPath, visibility)
 * PUT: Update a post Requires userID, postID, and at least one of the optional parameters 
 * (textContent, photoPath, videoPath, visibility, username)
 * DELETE: Delete a post Requires postID
 * 
 * 
 * @package App\EndpointController
 * @author Hassan <w20017074@northumbria.ac.uk>
 */

use App\{
    ClientError,
    Database,
    Request
};

class Post extends Endpoint
{
    private $db;
    private $allowedParams = [
        'textContent',
        'photoPath',
        'videoPath',
        'visibility',
        'location',
        'postID',
        'userID',
        'firstName',
        'lastName',
        'username'
    ];
    private $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

    public function __construct()
    {
        $this->db = new Database(DB_PATH);
        parent::__construct($this->executeAction(Request::method()));
    }


    private function executeAction($method)
    {
        switch ($method) {
            case 'GET':
                return $this->get();
            case 'POST':
                return $this->post();
            case 'PUT':
                return $this->updatePost();
            case 'DELETE':
                return $this->delete();
            default:
                throw new ClientError(405, "Method Not Allowed");
        }
    }

    /**
     * This method is responsible for handling GET requests to the post endpoint.
     * It can handle GET requests with optional postID, userID and visibility parameters.
     * No parameters returns all posts with public visibility.
     *
     * @return array
     * @throws ClientError
     */
    private function get()
    {
        $db = new Database(DB_PATH);

        $conditions = [];
        $sqlParams = [];

        if (isset($_GET['postID'])) {
            $conditions[] = "postID = :postID";
            $sqlParams[':postID'] = $_GET['postID'];
        }

        if (isset($_GET['userID'])) {
            $conditions[] = "userID = :userID";
            $sqlParams[':userID'] = $_GET['userID'];
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(' AND ', $conditions) : '';

        $sql = "SELECT Post.*, Profile.profilePicturePath FROM post
        JOIN profile ON Post.userID = Profile.userID
        $whereClause";
        $data = $db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed or no post found";
        return $data;
    }

    /**
     * This method is responsible for handling POST requests to the post endpoint.
     *
     * It can handle POST requests. Requires: userID, username, and at least one of
     * the optional parameters (textContent, location, photoPath, videoPath, visibility)
     * sets default values for optional parameters if not provided
     * visibility defaults to 'friends' only
     *
     * @return array
     * @throws ClientError
     */
    private function post()
    {
        // $this->validateToken();
        $this->setProperties();
        $requiredParams = ['userID', 'username', 'firstName', 'lastName'];
        $optionalParams = ['textContent', 'location', 'photoPath', 'videoPath', 'visibility'];

        $defaultValues = [
            'textContent' => null,
            'location' => null,
            'photoPath' => null,
            'videoPath' => null,
            'visibility' => 'friends',
        ];
        
        $this->checkRequiredParams($this->requestData, $requiredParams);
        if (!isset($this->requestData['textContent']) || !isset($this->requestData['photoPath']) || !isset($this->requestData['videoPath'])) {
            throw new ClientError(400, "At least one of the optional parameters (textContent, photoPath, videoPath) is required");
        }

        $postParams = array_merge($defaultValues, $this->requestData);
        $placeholders = implode(', ', array_map(function ($param) {
            return ":$param";
        }, array_keys($postParams)));
        $sqlParams = array_merge(array_values($this->requestData));
        $sql = "INSERT INTO post (" . implode(', ', array_keys($postParams)) . ") VALUES ($placeholders)";
        $data = $this->db->executeSQL($sql, $sqlParams);
        $data['lastInsertId'] > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * This method is responsible for handling PUT requests to the post endpoint.
     *
     * It can handle PUT requests. Requires: userID, postID, and at least one of
     * the optional parameters (textContent, photoPath, videoPath, visibility, username, location)
     *
     * @return array
     * @throws ClientError
     */
    private function updatePost()
    {
        // $this->validateToken();
        $this->setProperties();
        $requiredParams = [
            'userID',
            'postID'
        ];
        $optionalParams = [
            'textContent',
            'photoPath',
            'videoPath',
            'visibility',
            'location'
        ];
        $keys = $this->postFieldKeys($requiredParams, $optionalParams);

        $validParams = array_intersect_key($this->requestData, array_flip($keys));
        $setClauses = array_map(function ($param) use ($validParams) {
            if (array_key_exists($param, $validParams)) {
                return "$param = :$param";
            }
        }, array_keys($validParams));

        $setClauses = array_filter($setClauses);

        $sql = "UPDATE post SET " . implode(', ', $setClauses);
        $sql .= " WHERE userID = :userID AND postID = :postID";
        $sqlParams = array_merge(
            array_intersect_key($this->requestData, array_flip($optionalParams)),
            [':userID' => $this->requestData['userID'], ':postID' => $this->requestData['postID']]
        );

        $data = $this->db->executeSQL($sql, $sqlParams);
        $data['rowCount'] > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }


    /**
     * This method is responsible for handling DELETE requests to the post endpoint.
     * It requires the postID parameter.
     *
     * @return array
     * @throws ClientError
     */
    private function delete()
    {
        // $this->validateToken();
        if (!isset($_GET['postID'])) {
            throw new ClientError(400, "postID is required");
        }
        $sql = "DELETE FROM post WHERE postID = :postID";
        $sqlParams = [':postID' => $_GET['postID']];

        $data = $this->db->executeSQL($sql, $sqlParams);
        $data['rowCount'] > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    protected function postFieldKeys(array $requiredParams, array $optionalParams = [])
    {
        $providedOptionalParams = array_intersect($optionalParams, array_keys($this->requestData));
        if (empty($providedOptionalParams)) {
            throw new ClientError(422, "At least one of the optional parameters ("
                . json_encode($optionalParams) . ") is required");
        }

        $allParams = array_merge($requiredParams, $optionalParams);
        $providedPropertyKeys = array_intersect($this->allowedParams, array_keys($this->requestData));

        if (empty($providedPropertyKeys)) {
            throw new ClientError(422, "At least one property of the post is required");
        }

        $keys = array_intersect($providedPropertyKeys, $allParams);

        if (empty($keys)) {
            throw new ClientError(400, "No valid parameters provided");
        }
        return $keys;
    }
}