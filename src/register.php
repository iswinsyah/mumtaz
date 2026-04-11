<?php
// Mengizinkan akses dari browser (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Tangkap data JSON dari React
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data->username)) {
    // ================================================================
    // TODO: GANTI DENGAN KREDENSIAL DATABASE HOSTINGER BOS!
    // ================================================================
    $host = "localhost";
    $db_name = "u123456789_tahfidz"; // Ganti dengan nama database bos
    $username = "u123456789_user";   // Ganti dengan user database bos
    $password = "PasswordKuat123!";  // Ganti dengan password database bos
    // ================================================================

    try {
        $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "INSERT INTO users (fullname, username, whatsapp, email, gender, dob, domicile, infaq_choice) 
                  VALUES (:fullname, :username, :whatsapp, :email, :gender, :dob, :domicile, :infaq_choice)";
        
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(":fullname", $data->fullname);
        $stmt->bindParam(":username", $data->username);
        $stmt->bindParam(":whatsapp", $data->whatsapp);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":gender", $data->gender);
        $stmt->bindParam(":dob", $data->dob);
        $stmt->bindParam(":domicile", $data->domicile);
        $stmt->bindParam(":infaq_choice", $data->infaq);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("status" => "success", "message" => "Pendaftaran berhasil."));
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        if ($exception->getCode() == 23000) {
            echo json_encode(array("status" => "error", "message" => "Username atau Email sudah pernah terdaftar!"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Error Database: " . $exception->getMessage()));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Data tidak lengkap."));
}
?>