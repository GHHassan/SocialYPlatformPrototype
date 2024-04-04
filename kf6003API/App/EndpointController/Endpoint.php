<?php

namespace App\EndpointController;

/**
 * Endpoint class
 * 
 * A blueprint for the other endpoints in this project
 * that inherit it. It is responsible for connecting to
 * the database and returning the data in JSON format.
 * It does not support any parameters.
 * Limits access to only GET requests. This only 
 * applies to the endpoints that inherit this class and
 * call the parent constructor. In its constructor,
 * this also includes the `initialise()` method that
 * is used by some of the child classes.
 * provides token validation and sanitisation methods
 * 
 * @package App\EndpointController
 * @author Hassan
 */

use App\{
    ClientError,
    Database,
    Requesthandler,
    Request
};
use Firebase\JWT\JWT;

class Endpoint
{
    private $sql;
    private $sqlParams;
    private $data;
    private $db;
    private $allowedMethods = ['GET'];
    private $userID;
    protected $requestData;
    private $allowedParams = [];

    public function __construct($data = ["message" => []])
    {
        $this->setData($data);
    }
    protected function handleRequest()
    {
        $this->setProperties();
        $this->initialiseSQL();
        $this->performAction();
    }

    // New method to perform the specific action for the endpoint
    protected function performAction()
    {
        // This method should be implemented by child classes
    }

    protected function checkAllowedMethod($methods, $allowedMethods = [])
    {
        if (!in_array(Request::method(), $allowedMethods)) {
            throw new ClientError(405);
        }
    }

    protected function checkRequiredParams($params, $requiredParams = [])
    {
        if (!is_array($params)) {
            $params = [$params];
        }

        foreach ($requiredParams as $param) {
            if (!array_key_exists($param, $params)) {
                throw new ClientError(422, "Missing parameter: $param");
            }
        }
    }
    protected function sanitiseNum($input)
    {
        if (isset($input) && is_numeric($input)) {
            $result = filter_var($input, FILTER_SANITIZE_NUMBER_INT);
            return $result;
        }
        return $input;
    }

    protected function sanitiseString($input)
    {
        if (isset($input) && !empty($input) && is_string($input)) {
            $result = htmlspecialchars($input);
            return $result;
        }
        return $input;
    }

    protected function sanitiseEmail($input)
    {
        if (isset($input) && !empty($input) && is_string($input)) {
            $result = filter_var($input, FILTER_SANITIZE_EMAIL);
            return $result;
        }
        return $input;
    }

    protected function validateToken()
    {
        $key = SECRET;
        $jwt = $this->getBearerToken();
        try {
            $decodedJWT = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));
            if ($decodedJWT->exp < time()) {
                throw new ClientError(402, 'Token expired');
            }
            if ($decodedJWT->iss !== $_SERVER['HTTP_HOST']) {
                throw new \UnexpectedValueException('Token not valid for this server');
            }
            return $decodedJWT->sub;
        } catch (\UnexpectedValueException $e) {
            throw new ClientError(401, $e->getMessage());
        }
    }

    protected function getBearerToken()
    {
        $allHeaders = getallheaders();
        $authorizationHeader = "";

        if (array_key_exists('Authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['Authorization'];
        } elseif (array_key_exists('authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['authorization'];
        }

        if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
            throw new ClientError(401);
        }

        return trim(substr($authorizationHeader, 7));
    }

    /**
     * Set properties based on request data or query parameters.
     */
    protected function setProperties()
    {
        if ((new Requesthandler())->getData() !== null) {
            $this->requestData = (new Requesthandler())->getData();
            foreach ($this->allowedParams as $param) {
                if (Requesthandler::hasParam($param)) {
                    $this->{$param} = Requesthandler::getParam($param);
                }
            }
        }
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

    public function setSql($sql)
    {
        $this->sql = $sql;
    }

    public function getSQL()
    {
        return $this->sql;
    }

    public function getSQLParams()
    {
        return $this->sqlParams;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setData($data)
    {
        $this->data = $data;
    }

    public function setSQLParams($sqlParams)
    {
        $this->sqlParams = $sqlParams;
    }

    protected function initialiseSQL()
    {
        $sql = "";
        $this->setSql($sql);
        $this->setSQLParams([]);
    }

    public function setAllowedParams($allowedParams)
    {
        $this->allowedParams = $allowedParams;
    }

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    public function setAllowedMethods($allowedMethods)
    {
        $this->allowedMethods = $allowedMethods;
    }
}
