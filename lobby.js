const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
}));

// Middleware de autenticação
function autenticar(req, res, next) {
    if (!req.session.usuarioAutenticado) {
        res.redirect('/login');
    } else {
        next();
    }
}

// Função para ler dados do arquivo JSON
function lerDadosLobby() {
    const dataPath = path.join(__dirname, 'lobbyData.json');
    if (!fs.existsSync(dataPath)) {
        return { lobbies: [] };
    }
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
}

// Função para escrever dados no arquivo JSON
function escreverDadosLobby(data) {
    const dataPath = path.join(__dirname, 'lobbyData.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Rota de login
app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="usuario" placeholder="Usuário" required>
            <input type="password" name="senha" placeholder="Senha" required>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    req.session.usuarioAutenticado = true;
    req.session.nomeUsuario = req.body.usuario;
    res.redirect('/');
});

// Rota principal do lobby
app.get('/', autenticar, (req, res) => {
    const lobbyId = req.query.lobby_id;
    if (!lobbyId) {
        return res.redirect('/lobby-espera');
    }

    const data = lerDadosLobby();
    const lobby = data.lobbies.find(l => l.id === lobbyId);

    if (!lobby) {
        return res.redirect('/lobby-espera');
    }

    let jogadoresHtml = '<p>Nenhum jogador no lobby ainda.</p>';
    if (lobby.jogadores.length > 0) {
        jogadoresHtml = '<h2>Jogadores no Lobby:</h2><ul>';
        lobby.jogadores.forEach(nomeJogador => {
            jogadoresHtml += `<li>${nomeJogador}</li>`;
        });
        jogadoresHtml += '</ul>';
    }

    const lobbyOwner = lobby.jogadores[0] === req.session.nomeUsuario;

    let startGameButton = '';
    if (lobbyOwner) {
        startGameButton = `<form action="http://localhost:8080/war/GAME/index.php" method="post">
                            <input type="submit" name="start-game" value="Iniciar o Jogo">
                           </form>`;
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lobby - War Game</title>
        </head>
        <body>
            <h1>Lobby ${lobbyId}</h1>
            <p>Bem-vindo, ${req.session.nomeUsuario}!</p>
            ${jogadoresHtml}
            ${startGameButton}
            <form method="POST" action="/sair-lobby">
                <input type="hidden" name="lobby_id" value="${lobbyId}">
                <input type="submit" name="sair-lobby" value="Sair do Lobby">
            </form>
            <p><a href="/lobby-espera">Voltar para Lista de Lobbys</a></p>
        </body>
        </html>
    `);
});

// Rota para sair do lobby
app.post('/sair-lobby', autenticar, (req, res) => {
    const lobbyId = req.body.lobby_id;
    const nomeJogador = req.session.nomeUsuario;

    const data = lerDadosLobby();
    const lobby = data.lobbies.find(l => l.id === lobbyId);

    if (lobby) {
        lobby.jogadores = lobby.jogadores.filter(j => j !== nomeJogador);
        if (lobby.jogadores.length === 0) {
            data.lobbies = data.lobbies.filter(l => l.id !== lobbyId);
        }
        escreverDadosLobby(data);
    }
    res.redirect('/lobby-espera');
});

// Rota de espera do lobby
app.get('/lobby-espera', (req, res) => {
    res.send('<p>Página de espera do lobby</p>');
});

// Rota para obter informações do lobby (para o client-side)
app.get('/lobby-info', autenticar, (req, res) => {
    const lobbyId = req.query.lobby_id;
    const data = lerDadosLobby();
    const lobby = data.lobbies.find(l => l.id === lobbyId);

    if (!lobby) {
        return res.json({ error: 'Lobby não encontrado' });
    }

    const lobbyOwner = lobby.jogadores[0] === req.session.nomeUsuario;

    res.json({
        nomeUsuario: req.session.nomeUsuario,
        jogadores: lobby.jogadores,
        lobbyOwner: lobbyOwner,
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
