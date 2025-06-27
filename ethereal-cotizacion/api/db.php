<?php
$host = 'localhost';
$db = 'ethereal-code';
$user = 'root';
$pass = 'mysql';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Error DB: " . $e->getMessage());
}
