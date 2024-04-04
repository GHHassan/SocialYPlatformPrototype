<?php

namespace App;

/**
 * Request
 * 
 * Abstract class to get information about the HTTP request.
 * 
 * The methods in this class are static so they can be called
 * without creating an instance of the class.
 * 
 * @return Request method, endpoint name, and URL parameters
 * @author H Hassani <w20017074@northumbria.ac.uk>
 */

abstract class Request 
{
    public static function method()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function endpointName()
    {
        $url = $_SERVER["REQUEST_URI"];
        $path = parse_url($url)['path'];
        return str_replace(BASE_URL, "", $path);
    }
}

