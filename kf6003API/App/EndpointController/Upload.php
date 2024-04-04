<?php

namespace App\EndpointController;

use App\{
    Request,
    ClientError
};

class Upload extends Endpoint
{
    private $uploadDir;
    protected $requestData;
    private $allowedParams = ['image', 'video'];
    private $allowedMethods = ['POST', 'DELETE'];
    private $maxImageSize = 2 * 1024 * 1024; // 2MB
    private $maxVideoSize = 2 * 1024 * 1024; // 2MB
    private $data = [];

    public function __construct()
    {
        // $this->validateToken();
        $this->checkAllowedMethod(Request::method(), $this->allowedMethods);
        $this->performAction();
        parent::__construct($this->data);
    }

    protected function performAction()
    {
        switch (Request::method()) {
            case 'POST':
                $this->data = $this->uploadData();
                break;
            case 'DELETE':
                $this->data = $this->deleteFile();
                break;
            default:
                throw new ClientError(405, 'Method Not Allowed');
        }
    }

    private function validateFileType($file, $allowedTypes)
    {
        $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($fileInfo, $file);
        finfo_close($fileInfo);

        if (!in_array($mimeType, $allowedTypes)) {
            throw new ClientError(422, 'Invalid file type');
        }
    }

    private function deleteFile()
    {
        if ($_GET['image']) {
            return $this->deleteImage($_GET['image']);
        }
        if ($_GET['video']) {
            return $this->deleteVideo($_GET['video']);
        }
    }

    private function deleteImage($imageName)
    {
        // $this->validateToken();
        $data = [];
        if (!$imageName) {
            return ['message' => 'No image to delete'];
        }

        if (strpos($imageName, DOMAIN_PATH) !== false) {
            $imageName = str_replace(DOMAIN_PATH, '../', $imageName);
            if (strpos($imageName, '../FileStorage/Images/') !== false) {
                if ($imageName && file_exists($imageName)) {
                    unlink($imageName);
                    $data['image'] = 'Image deleted successfully';
                }
            }
        }
        $data['message'] = count($data) > 0 ? 'success' : 'No files deleted';
        return $data;
    }

    private function deleteVideo($videoName)
    {
        // $this->validateToken();
        $data = [];
        if (!$videoName) {
            return ['message' => 'No video to delete'];
        }

        if (strpos($videoName, DOMAIN_PATH) !== false) {
            $videoName = str_replace(DOMAIN_PATH, '', $videoName);
            if (strpos($videoName, '../FileStorage/Videos/') !== false) {
                $videoName = str_replace('../FileStorage/Videos/', '', $videoName);
            }
        }

        $videoPath = '../FileStorage/Videos/' . $videoName;

        if ($videoName && file_exists($videoPath)) {
            unlink($videoPath);
            $data['video'] = 'Video deleted successfully';
        }

        $data['message'] = count($data) > 0 ? 'success' : 'No files deleted';
        return $data;
    }

    public function uploadData()
    {
        $image = '';
        $video = '';
        if (Request::method() == 'POST') {
            $image = 'image';
            $video = 'video';
        }
        if (!isset($_FILES[$image]) && !isset($_FILES[$video])) {
            return ['message' => 'No file to upload'];
        }
        if (isset($_FILES[$image]) && isset($_FILES[$video])) {
            $data['imageUpload'] = $this->uploadImage();
            $data['videoUpload'] = $this->uploadVideo();
            return $data;
        }
        if (isset($_FILES[$image])) {
            return $this->uploadImage();
        }
        if (isset($_FILES[$video])) {
            return $this->uploadVideo();
        }
    }

    private function uploadImage()
    {
        $this->uploadDir = '../FileStorage/Images/';
        $uploadedFile = $_FILES['image']['tmp_name'];
        $fileSizeInBytes = $_FILES['image']['size'];

        // Check if the file size exceeds the maximum limit
        if ($fileSizeInBytes > $this->maxImageSize) {
            return ['message' => 'File size exceeds the maximum limit of ' . $this->maxImageSize . ' bytes'];
        }
        // Validate file type
        $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image MIME types if needed
        try {
            $this->validateFileType($uploadedFile, $allowedImageTypes);
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }

        // Check if the uploaded file is an image
        $imageInfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($imageInfo, $uploadedFile);
        finfo_close($imageInfo);

        if (strpos($mimeType, 'image/') !== 0) {
            return ['message' => 'Invalid image file format'];
        }

        $originalFileName = $_FILES['image']['name'];
        $uniqueFileName = time() . '_' . $originalFileName;
        $destination = $this->uploadDir . $uniqueFileName;

        // Move the uploaded image to the specified directory
        move_uploaded_file($uploadedFile, $destination);

        $url = str_replace('../', 'https://w20017074.nuwebspace.co.uk/', $destination);
        return $url ? ['message' => 'success', 'imageURL' => $url] : ['message' => 'failed'];
    }

    private function uploadVideo()
    {
        $this->uploadDir = '../FileStorage/Videos/';
        $uploadedFile = $_FILES['video']['tmp_name'];
        $fileSizeInBytes = $_FILES['video']['size'];

        // Check if the file size exceeds the maximum limit
        if ($fileSizeInBytes > $this->maxVideoSize) {
            return ['message' => 'File size exceeds the maximum limit of ' . $this->maxVideoSize . ' bytes'];
        }

        // Check if the uploaded file is a video
        $videoInfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($videoInfo, $uploadedFile);
        finfo_close($videoInfo);

        // $allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime']; // Add more video MIME types if needed
        // if (!in_array($mimeType, $allowedVideoTypes)) {
        //     return ['message' => 'Invalid video file format'];
        // }
        // Validate file type
        $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image MIME types if needed
        try {
            $this->validateFileType($uploadedFile, $allowedImageTypes);
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }

        $originalFileName = $_FILES['video']['name'];
        $uniqueFileName = time() . '_' . $originalFileName;
        $destination = $this->uploadDir . $uniqueFileName;

        // Move the uploaded video to the specified directory
        move_uploaded_file($uploadedFile, $destination);

        $url = str_replace('../', 'https://w20017074.nuwebspace.co.uk/', $destination);
        return $url ? ['message' => 'success', 'videoURL' => $url] : ['message' => 'failed'];
    }


    private function buildSqlParams(array $updateFields)
    {
        $sqlParams = [];

        foreach ($updateFields as $property) {
            if (isset($this->requestData[$property])) {
                $sqlParams[":$property"] = $this->requestData[$property];
            }
        }
        return $sqlParams;
    }

    private function validateRequiredParams(array $requiredParams)
    {
        if (array_intersect($requiredParams, array_keys($this->requestData)) !== $requiredParams) {
            throw new ClientError(422, "At least one of the required parameters (" .
                (json_encode($requiredParams)) . ") is required");
        }
    }

}
