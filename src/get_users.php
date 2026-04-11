<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// ================================================================
$host = "localhost";
$db_name = "u829486010_h5bER";
$username = "u123456789_user";   // TODO: GANTI DENGAN USER DB BOS
$password = "PasswordKuat123!";  // TODO: GANTI DENGAN PASSWORD DB BOS
// ================================================================

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ambil data user, urutkan dari yang terbaru daftar
    $query = "SELECT id, fullname, username, whatsapp, domicile, infaq_choice, created_at FROM users ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode(array("status" => "success", "data" => $users));
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Error Database: " . $exception->getMessage()));
}
?>