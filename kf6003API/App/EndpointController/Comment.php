<?php

namespace App\EndpointController;

/**
 * Class Comment
 *
 * This class is responsible for handling the requests to the comment endpoint.
 * It can handle GET, POST, PUT, and DELETE requests for comments related to posts.
 *
 * Parameters: should be passed as JSON in the body of the HTTP request
 *
 * HTTP Request Methods:
 * GET:    Get comments for a post by postID or for a user by userID
 * POST:   Create a new comment on a post Requires postID, userID, username, and commentContent
 * PUT:    Update a comment Requires commentID, userID, and at least one of the optional parameters (commentContent, username)
 * DELETE: Delete a comment Requires commentID
 *
 * @package App\EndpointController
 * @author Hassan <w20017074@northumbria.ac.uk>
 */
use App\{
    ClientError,
    Database,
    Request,
    Requesthandler
};

class Comment extends Endpoint
{
    private $commentID;
    private $postID;
    private $userID;
    private $commentContent;
    protected $requestData;

    private $allowedParams = [
        'commentContent',
        'postID',
        'userID',
        'username',
        'firstName',
        'lastName',
        'profilePath',
        'commentID',
        'imagePath',
        'videoPath',
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
        $this->checkAllowedMethod(Request::method(), $this->allowedMethods);
        $this->checkRequiredParams($this->allowedParams);
        $data = [];
        switch (Request::method()) {
            case 'GET':
                $data = $this->get();
                break;
            case 'POST':
                $data = $this->post();
                break;
            case 'PUT':
                $data = $this->updateComment();
                break;
            case 'DELETE':
                $data = $this->delete();
                break;
        }
        parent::__construct($data);
    }

    /**
     * Get comments for a post or for a user.
     * If postID is provided, get comments for that post; if userID is provided, get comments for that user.
     * If both postID and userID are provided, return comments for the specific user on that post.
     * If no parameters are provided, return all comments.
     *
     * @return array
     * @throws ClientError
     */
    private function get()
    {
        $db = new Database(DB_PATH);

        $conditions = [];
        $sqlParams = [];

        if (isset($_GET['commentID'])) {
            $conditions[] = "commentID = :commentID";
            $sqlParams[':commentID'] = $_GET['commentID'];
        }

        if (isset($_GET['postID'])) {
            $conditions[] = "postID = :postID";
            $sqlParams[':postID'] = $_GET['postID'];
        }

        if (isset($_GET['userID'])) {
            $conditions[] = "userID = :userID";
            $sqlParams[':userID'] = $_GET['userID'];
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(' AND ', $conditions) : '';

        $sql = "SELECT * FROM comment $whereClause";

        $data = $db->executeSQL($sql, $sqlParams);
        $data['message'] = count($data) > 0 ? "success" : "failed";

        return $data;
    }

    /**
     * Create a new comment on a post.
     * Requires postID, userID, username, and commentContent.
     *
     * @return array
     * @throws ClientError
     */
    private function post()
    {
        // $this->validateToken();
        $this->setProperties();
        $requiredParams = ['postID', 'userID', 'profilePath', 'username', 'firstName', 'lastName', 'commentContent'];
        foreach ($requiredParams as $param) {
            if (!isset($this->requestData[$param])) {
                throw new ClientError(422, "All required parameters". implode($requiredParams) ."are mandatory.");
            }
        }

        $paramKeys = array_intersect($this->allowedParams, array_keys($this->requestData));
        $placeholders = implode(', ', array_map(function ($param) {
            return ":$param";
        }, $paramKeys));

        $sql = "INSERT INTO comment (" . implode(', ', $paramKeys) . ") VALUES ($placeholders)";
        $sqlParams = [];
        foreach ($paramKeys as $param) {
            $sqlParams[":$param"] = $this->requestData[$param];
        }
        $data = $this->db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * Update a comment.
     * Requires commentID, userID, and at least one of the optional parameters (commentContent).
     *
     * @return array
     * @throws ClientError
     */
    private function updateComment()
    {
        // $this->validateToken();
        $this->setProperties();
        $requiredParams = ['commentID', 'userID', 'commentContent'];

        $providedParams = array_intersect($requiredParams, array_keys($this->requestData));
        if (count($providedParams) !== count($requiredParams)) {
            throw new ClientError(422, "All required parameters ('commentID', 'userID') are mandatory.");
        }

        $providedPropertyKeys = array_intersect($this->allowedParams, array_keys($this->requestData));

        if (empty($providedPropertyKeys)) {
            throw new ClientError(422, "At least one property of the comment is required");
        }

        $updateFields = array_intersect($providedPropertyKeys, $providedParams);

        if (empty($updateFields)) {
            throw new ClientError(400, "No valid parameters provided for updating a comment.");
        }

        $setClauses = array_map(
            function ($column) {
                return "$column = :$column";
            },
            $updateFields
        );

        $sql = "UPDATE comment SET " . implode(', ', $setClauses);
        $sql .= " WHERE commentID = :commentID AND userID = :userID";
        $sqlParams = [];

        foreach ($providedParams as $property) {
            if (isset($this->requestData[$property])) {
                $sqlParams[":$property"] = $this->requestData[$property];
            }
        }
        $data = $this->db->executeSQL($sql, $sqlParams);
        count($data) > 0 ? $data['message'] = "success" : $data['message'] = "failed";
        return $data;
    }

    /**
     * Delete a comment by commentID.
     *
     * @return array
     * @throws ClientError
     */
    private function delete()
    {
        // $this->validateToken();
        if (!isset($_GET['commentID']) && !isset($_GET['postID'])) {
            throw new ClientError(422, "CommentID or postID is required");
        }
    
        $sql = isset($_GET['postID'])
            ? "DELETE FROM comment WHERE postID = :postID"
            : "DELETE FROM comment WHERE commentID = :commentID";
    
        $sqlParams = isset($_GET['postID'])
            ? [':postID' => $_GET['postID']]
            : [':commentID' => $_GET['commentID']];
    
        $data = $this->db->executeSQL($sql, $sqlParams);
        $data['message'] = count($data) > 0 ? "success" : "failed";
    
        return $data;
    }    
}
