<?php
// Mengizinkan akses dari browser (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Tangkap data JSON dari React
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data->username) && !empty($data->password)) {
    // ================================================================
    // TODO: GANTI DENGAN KREDENSIAL DATABASE HOSTINGER BOS!
    // ================================================================
    $host = "localhost";
    $db_name = "u829486010_h5bER"; // Ganti dengan nama database bos
    $username = "u123456789_user";   // Ganti dengan user database bos
    $password = "PasswordKuat123!";  // Ganti dengan password database bos
    // ================================================================

    try {
        $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Cari user berdasarkan username saja
        $query = "SELECT fullname, username, password, infaq_choice FROM users WHERE username = :username LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":username", $data->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verifikasi Password Hash
            if (password_verify($data->password, $row['password'])) {
                http_response_code(200);
                echo json_encode(array(
                    "status" => "success", 
                    "message" => "Login berhasil.",
                    "user" => array(
                        "name" => $row['fullname'],
                        "username" => $row['username'],
                        "isPremium" => ($row['infaq_choice'] > 0) ? true : false
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("status" => "error", "message" => "Password yang Anda masukkan salah."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("status" => "error", "message" => "Username tidak ditemukan."));
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Error Database: " . $exception->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Data login tidak lengkap."));
}
?>