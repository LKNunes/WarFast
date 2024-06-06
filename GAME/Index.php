<?php
session_start();

// Verifique se o usuário está autenticado
if (!isset($_SESSION['usuario_autenticado'])) {
    // O usuário não está autenticado, redirecione para a página de login
    header('Location: http://localhost:8080/war/index.html');
    exit();
}

// Configurações de conexão com o banco de dados

    $servername = "localhost"; // Endereço do servidor (geralmente "localhost" para desenvolvimento local)
    $username = "root"; // Nome de usuário do banco de dados
    $password = ""; // Senha do banco de dados
    $database = "war"; // Nome do banco de dados

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verifique a conexão
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

// Função para recuperar o estado do jogo do banco de dados
function carregarEstadoDoJogo($conn) {
    $query = "SELECT state FROM game_state WHERE id = 1";
    $result = $conn->query($query);
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return unserialize($row['state']);
    } else {
        return null; // Não foi possível recuperar o estado do jogo
    }
}

// Carregar o estado do jogo
$estadoDoJogo = carregarEstadoDoJogo($conn);
?>

<!DOCTYPE html>
<html>
<head>
    <title>War Game</title>
    <style>
        /* Estilo para posicionar os territórios lado a lado e torná-los fixos */
        .territorio {
            position: absolute;
        }

        #territorioBrasil {
            left: 100px;
        }

        #territorioArgentina {
            left: 113px;
            bottom: 702px;
        }
    </style>
</head>
<body>
    <h1>War Game</h1>
    <div id="territorios">
        <!-- Área onde os territórios serão exibidos -->
        <div class="territorio" id="territorioBrasil">
            <img class="territorioImagem" alt="Território Brasil" src="">
        </div>
        <div class="territorio" id="territorioArgentina">
            <img class="territorioImagem" alt="Território Argentina" src="">
        </div>
    </div>

    <script src="scriptwar.js"></script>

    <script>
        // Carregue o estado do jogo no JavaScript
        var estadoDoJogo = <?php echo json_encode($estadoDoJogo); ?>;
        // Use o estado do jogo para restaurar o jogo no lado do cliente
        // Implemente a lógica JavaScript necessária para renderizar o jogo com base no estado.
    </script>
</body>
</html>
