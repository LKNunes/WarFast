<?php
session_start(); // Inicie a sessão (se ainda não estiver iniciada)

// Verifique se o usuário está autenticado (você deve implementar a lógica de autenticação)
if (!isset($_SESSION['usuario_autenticado']) || $_SESSION['usuario_autenticado'] !== true) {
    header('Location: login.php'); // Redirecione para a página de login se não estiver autenticado
    exit();
}

// Configurações de conexão com o banco de dados
$servername = "localhost"; // Endereço do servidor (geralmente "localhost" para desenvolvimento local)
$username = "root"; // Nome de usuário do banco de dados
$password = ""; // Senha do banco de dados
$database = "war"; // Nome do banco de dados

// Cria uma conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Função para criar um novo lobby
function criarLobby($conn, $nomeLobby) {

    // Inserir o novo lobby no banco de dados
    $sql = "INSERT INTO lobbies (nome_lobby) VALUES ('$nomeLobby')";
    if ($conn->query($sql) === true) {
        return $lobby_id; // Retorne o ID do lobby criado
    } else {
        return false; // Retorna falso se houver erro ao criar o lobby
    }
}

// Função para adicionar um jogador a um lobby
function adicionarJogadorAoLobby($conn, $lobby_id, $nome_jogador) {
    // Inserir o jogador no lobby no banco de dados
    $sql = "INSERT INTO lobby (id_lobby, nome_jogador) VALUES ('$lobby_id', '$nome_jogador')";
    return $conn->query($sql);
}

// Função para remover um jogador de um lobby
function removerJogadorDoLobby($conn, $lobby_id, $nome_jogador) {
    // Remover o jogador do lobby no banco de dados
    $sql = "DELETE FROM lobby WHERE id_lobby = '$lobby_id' AND nome_jogador = '$nome_jogador'";
    return $conn->query($sql);
}

// Verifique se o usuário deseja criar ou entrar em um lobby
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["criar-lobby"])) {
        $nomeLobby = $_POST["nome-lobby"]; // Obtenha o nome do lobby do formulário

        $lobby_id = criarLobby($conn, $nomeLobby);
        if ($lobby_id) {
            // Lobby criado com sucesso, redirecione para a página do lobby
            header("Location: lobby.php?lobby_id=$lobby_id");
            exit();
        } else {
            echo "Erro ao criar o lobby.";
        }
    } elseif (isset($_POST["entrar-lobby"])) {
        $lobby_id = $_POST["lobby_id"]; // Obtenha o ID do lobby do formulário
        $nome_jogador = $_SESSION['nome_usuario']; // Obtém o nome do jogador da sessão

        // Adicione o jogador ao lobby
        if (adicionarJogadorAoLobby($conn, $lobby_id, $nome_jogador)) {
            // Jogador adicionado com sucesso, redirecione para a página do lobby
            header("Location: lobby.php?lobby_id=$lobby_id");
            exit();
        } else {
            echo "Erro ao entrar no lobby.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Lobby de Espera - War Game</title>
</head>
<body>
    <h1>Lobby de Espera</h1>
    <p>Bem-vindo, <?php echo $_SESSION['nome_usuario']; ?>!</p>

    <h2>Criar Lobby</h2>
    <form action="" method="POST">
        <label for="nome-lobby">Nome do Lobby:</label>
        <input type="text" id="nome-lobby" name="nome-lobby" required>
        <input type="submit" name="criar-lobby" value="Criar Lobby">
    </form>

    <h2>Entrar em um Lobby Existente</h2>
    <form action="" method="POST">
        <label for="lobby_id">ID do Lobby:</label>
        <input type="text" id="lobby_id" name="lobby_id" required>
        <input type="submit" name="entrar-lobby" value="Entrar no Lobby">
    </form>

    <p>Lista de lobbies existentes:</p>
    <ul>
        <?php
        // Consulta SQL para obter a lista de lobbies existentes
        $sql = "SELECT * FROM lobbies";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $lobby_id = $row['lobby_id'];
                $nome_lobby = $row['nome_lobby'];
                echo "<li><a href='lobby.php?lobby_id=$lobby_id'>$nome_lobby</a></li>";
            }
        } else {
            echo "<li>Nenhum lobby existente.</li>";
        }
        ?>
    </ul>

    <p><a href="logout.php">Sair</a></p> <!-- Adicione a lógica de logout se necessário -->
</body>
</html>
