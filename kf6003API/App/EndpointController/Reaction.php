<?php

namespace App\EndpointController;

/**
 * Class Reactions
 *
 * This class is responsible for handling reactions (e.g., likes) on posts.
 * It can handle GET, POST, PUT, and DELETE requests for reactions.
 * Parameters: should be passed as JSON in the body of the HTTP request
 *
 * HTTP Request Methods:
 * GET: Get reactions for a post by postID or for a user by userID
 * POST: Create a new reaction on a post Requires postID, userID, and reactionType
 * PUT: Update a reaction Requires reactionID, userID, and newReactionType
 * DELETE: Delete a reaction Requires reactionID
 *
 * @package App\EndpointController
 * @author Hassan <w20017074@northumbria.ac.uk>
 */
use App\{
    ClientError,
    Database,
    Request
};

class Reaction extends Endpoint
{
    private $reactionID;
    private $postID;
    private $userID;
    private $reactionType;
    protected $requestData;

    private $allowedParams = [
        'postID',
        'userID',
        'reactionType',
        'reactionID'
    ];
    private $allowedMethods = [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ];

    public function __construct()
    {
        $this->db = new Database(DB_PATH);
        $this->handleRequest();
        parent::__construct($this->getData());
    }

    protected function performAction()
    {
        $data = [];
        switch (Request::method()) {
            case 'GET':
                $data = $this->get();
                break;
            case 'POST':
                $data = $this->post();
                break;
            case 'PUT':
                $data = $this->updateReaction();
                break;
            case 'DELETE':
                $data = $this->delete();
                break;
        }
        $this->$data = $data;
    }

    /**
     * Get reactions for a post or for a user.
     * If postID is provided, get reactions for that post; if userID is provided, get reactions for that user.
     * If both postID and userID are provided, return reactions for the specific user on that post.
     * If no parameters are provided, return all reactions.
     *
     * @return array
     * @throws ClientError
     */
    private function get()
    {
        $db = new Database(DB_PATH);
        if (isset($_GET['postID']) && isset($_GET['userID'])) {
            $sql = "SELECT * FROM reaction WHERE postID = :postID AND userID = :userID";
            $sqlParams = [':postID' => $_GET['postID'], ':userID' => $_GET['userID']];
            $data = $db->executeSQL($sql, $sqlParams);
            count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
            return $data;
        }

        if (isset($_GET['reactionID'])) {
            $sql = "SELECT * FROM reaction WHERE reactionID = :reactionID";
            $sqlParams = [':reactionID' => $_GET['reactionID']];
            $data = $db->executeSQL($sql, $sqlParams);
            count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
            return $data;
        }

        if (isset($_GET['postID'])) {
            $sql = "SELECT * FROM reaction WHERE postID = :postID";
            $sqlParams = [':postID' => $_GET['postID']];
            $data = $db->executeSQL($sql, $sqlParams);
            count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
            return $data;
        }

        if (isset($_GET['userID'])) {
            $sql = "SELECT * FROM reaction WHERE userID = :userID";
            $sqlParams = [':userID' => $_GET['userID']];
            $data = $db->executeSQL($sql, $sqlParams);
            count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
            return $data;
        }

        $sql = "SELECT * FROM reaction";
        $sqlParams = [];
        $data = $db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * Create a new reaction on a post.
     * Requires postID, userID, and reactionType.
     *
     * @return array
     * @throws ClientError
     */
    public function post()
    {
        $requiredParams = ['postID', 'userID', 'reactionType', 'profilePath'];
        foreach ($requiredParams as $param) {
            if (!isset($this->requestData[$param])) {
                throw new ClientError(422, "All required parameters ('postID', 'userID', 'reactionType') are mandatory.");
            }
        }
        $paramKeys = array_intersect($this->allowedParams, array_keys($this->requestData));

        $placeholders = implode(', ', array_map(function ($param) {
            return ":$param";
        }, $paramKeys));
        $sql = "INSERT INTO reaction (" . implode(', ', $paramKeys) . ") VALUES ($placeholders)";
        $sqlParams = [];
        foreach ($paramKeys as $param) {
            $sqlParams[":$param"] = $this->requestData[$param];
        }
        $data = $this->db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * Update a reaction.
     * Requires reactionID, userID, and newReactionType.
     *
     * @return array
     * @throws ClientError
     */
    public function updateReaction()
    {
        $requiredParams = ['reactionID', 'userID', 'reactionType'];

        foreach ($requiredParams as $param) {
            if (!isset($this->requestData[$param])) {
                throw new ClientError(422, "All required parameters ('reactionID', 'userID', 'reactionType') are mandatory.");
            }
        }

        $providedPropertyKeys = array_intersect($this->allowedParams, array_keys($this->requestData));
        $updateFields = array_intersect($providedPropertyKeys, array_keys($this->requestData));

        if (empty($updateFields)) {
            throw new ClientError(400, "No valid parameters provided for updating a reaction.");
        }
        // Construct the UPDATE query
        $setClauses = array_map(
            function ($column) {
                return "$column = :$column";
            },
            $updateFields
        );

        $sql = "UPDATE reaction SET " . implode(', ', $setClauses);
        $sql .= " WHERE reactionID = :reactionID";
        $sqlParams = [];

        foreach ($updateFields as $property) {
            if (isset($this->requestData[$property])) {
                $sqlParams[":$property"] = $this->requestData[$property];
            }
        }
        $data = $this->db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * Delete a reaction by reactionID.
     *
     * @return array
     * @throws ClientError
     */
    public function delete()
    {
        if (!isset($_GET['reactionID'])) {
            throw new ClientError(422, "ReactionID is required");
        }
        $sql = "DELETE FROM reaction WHERE reactionID = :reactionID";
        $sqlParams = [':reactionID' => $_GET['reactionID']];
        $data = $this->db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }
}
