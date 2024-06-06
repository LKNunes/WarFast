<?php
session_start(); // Inicie a sessão

// Encerre a sessão (faça logout)
session_unset();
session_destroy();

// Redirecione para a página de login ou outra página após o logout
header('Location: login.php');
exit();
?>
