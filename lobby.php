<?php
session_start(); // Inicie a sessão (se ainda não estiver iniciada)

// Verifique se o usuário está autenticado (você deve implementar a lógica de autenticação)
if (!isset($_SESSION['usuario_autenticado']) || $_SESSION['usuario_autenticado'] !== true) {
    header('Location: login.php'); // Redirecione para a página de login se não estiver autenticado
    exit();
}

// Verifique se o lobby_id foi passado como parâmetro na URL
if (!isset($_GET['lobby_id'])) {
    // Redirecione para a página de lobby de espera se o lobby_id não estiver definido
    header('Location: lobby-espera.php');
    exit();
}

$lobby_id = $_GET['lobby_id']; // Obtenha o lobby_id da URL
?>

<!DOCTYPE html>
<html>
<head>
    <title>Lobby - War Game</title>
</head>
<body>
    <h1>Lobby <?php echo $lobby_id; ?></h1>
    <p>Bem-vindo, <?php echo $_SESSION['nome_usuario']; ?>!</p>

    <!-- Conteúdo do lobby, incluindo interações com outros jogadores -->

    <?php
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

    // Consulta SQL para obter a lista de jogadores no lobby específico
    $lista_jogadores_sql = "SELECT nome_jogador FROM lobby WHERE id_lobby = '$lobby_id'";
    $lista_jogadores_result = $conn->query($lista_jogadores_sql);

    if ($lista_jogadores_result) {
        if ($lista_jogadores_result->num_rows > 0) {
            echo "<h2>Jogadores no Lobby:</h2>";
            echo "<ul>";
            while ($row = $lista_jogadores_result->fetch_assoc()) {
                $nome_jogador = $row['nome_jogador'];
                echo "<li>$nome_jogador</li>";
            }
            echo "</ul>";
        } else {
            echo "<p>Nenhum jogador no lobby ainda.</p>";
        }
    } else {
        echo "Erro na consulta SQL: " . $conn->error;
    }

    // Verifique se o usuário deseja sair do lobby
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["sair-lobby"])) {
        // Obtenha o nome do jogador da sessão
        $nome_jogador = $_SESSION['nome_usuario'];

        // Execute a consulta SQL para remover o jogador do lobby
        $sql = "DELETE FROM lobby WHERE id_lobby = '$lobby_id' AND nome_jogador = '$nome_jogador'";
        if ($conn->query($sql) === true) {
            // Jogador removido com sucesso do lobby, redirecione para a página de lobbies de espera
            header("Location: lobby-espera.php");
            exit();
        } else {
            echo "Erro ao sair do lobby: " . $conn->error;
        }
    }
		
		// Verifique se o jogador atual é o dono do lobby (ou seja, o criador)
	$lobby_owner = false; // Suponha que o jogador atual não seja o dono do lobby

	// Consulta SQL para obter o dono do lobby
	$lobby_owner_sql = "SELECT nome_jogador FROM lobby WHERE id_lobby = '$lobby_id' LIMIT 1";
	$lobby_owner_result = $conn->query($lobby_owner_sql);

	if ($lobby_owner_result && $lobby_owner_result->num_rows > 0) {
		$row = $lobby_owner_result->fetch_assoc();
		$lobby_owner = ($row['nome_jogador'] === $_SESSION['nome_usuario']);
	}

	if ($lobby_owner) {
		// Se o jogador atual é o dono do lobby, exiba um botão para iniciar o jogo
		echo '<form action="http://localhost:8080/war/GAME/index.php" method="post">
				<input type="submit" name="start-game" value="Iniciar o Jogo">
			  </form>';
	}
    ?>

    <form action="" method="POST">
        <input type="submit" name="sair-lobby" value="Sair do Lobby">
    </form>
	
    <p><a href="lobby-espera.php">Voltar para Lista de Lobbys</a></p> <!-- Redireciona para a tela de lobbies de espera -->
</body>
</html>
