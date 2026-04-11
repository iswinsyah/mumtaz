<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data->username) && !empty($data->avatar)) {
    // ================================================================
    $host = "localhost";
    $db_name = "u829486010_h5bER";
    $username = "u123456789_user";   // TODO: GANTI DENGAN USER DB BOS
    $password = "PasswordKuat123!";  // TODO: GANTI DENGAN PASSWORD DB BOS
    // ================================================================

    try {
        $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "UPDATE users SET avatar = :avatar WHERE username = :username";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":avatar", $data->avatar);
        $stmt->bindParam(":username", $data->username);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Avatar berhasil diperbarui."));
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Error Database: " . $exception->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Data tidak lengkap."));
}
?>