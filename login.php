<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Dados de conexão com o banco de dados
    $servername = "localhost"; // Endereço do servidor (geralmente "localhost" para desenvolvimento local)
    $username = "root"; // Nome de usuário do banco de dados
    $password = ""; // Senha do banco de dados
    $database = "war"; // Nome do banco de dados

    // Obtém os dados do formulário
    $user = $_POST["username"];
    $senha = $_POST["password"];

    // Cria uma conexão com o banco de dados
    $conn = new mysqli($servername, $username, $password, $database);

    // Verifica a conexão
    if ($conn->connect_error) {
        die("Falha na conexão: " . $conn->connect_error);
    }

    // Consulta SQL para verificar o usuário e senha
    $sql = "SELECT * FROM Usuarios WHERE User = '$user' AND Senha = '$senha'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Usuário válido, defina a variável de sessão e redirecione para a página do jogo
        $_SESSION['usuario_autenticado'] = true;
        $_SESSION['nome_usuario'] = $user;
        header("Location: http://localhost:8080/war/lobby-espera.php");
        exit();
    } else {
        // Usuário inválido, a senha ou o usuário estão incorretos
        echo "Usuário ou senha incorretos. Tente novamente.";
    }

    // Feche a conexão quando terminar
    $conn->close();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>War Game - Login</title>
</head>
<body>
    <h1>War Game - Login</h1>
    <form action="" method="POST">
        <label for="username">Nome de Usuário:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">Senha:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <input type="submit" value="Entrar">
    </form>
</body>
</html>