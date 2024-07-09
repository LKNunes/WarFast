document.addEventListener('DOMContentLoaded', function() {
  // Obtém o ID do lobby da URL
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');

  console.log('Lobby ID from URL:', lobbyId); // Debug: Check if lobby ID is being retrieved

  if (lobbyId) {
    // Faz uma requisição para obter os dados do db.json
    fetch('https://45.140.193.150:8443/lobbies')
      .then(response => {
        console.log('Response status:', response.status); // Debug: Check the response status
        return response.json();
      })
      .then(data => {
        console.log('Data from JSON:', data); // Debug: Log the data received from JSON
        if (!data || !Array.isArray(data)) {
          throw new Error('Estrutura do JSON inválida');
        }

        const lobby = data.find(lobby => lobby.id === lobbyId);
        console.log('Lobby found:', lobby); // Debug: Check if the correct lobby is found

        if (lobby) {
          // Atualiza a página com os dados do lobby
          document.getElementById('lobbyName').textContent = lobby.lobbyName;
          document.getElementById('lobbyadm').textContent = lobby.leaderId;
          document.getElementById('lobbyId').textContent = `${lobby.id}`;

          // Lista os jogadores
          const playersList = document.getElementById('playersList');
          playersList.innerHTML = ''; // Clear any previous content
          lobby.playerSlots.forEach(player => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${player}`;
            playersList.appendChild(listItem);
          });
        } else {
          document.getElementById('lobbyName').textContent = 'Lobby não encontrado';
          document.getElementById('lobbyDescription').textContent = '';
        }
      })
      .catch(error => {
        console.error('Erro ao carregar os dados do lobby:', error);
      });
  } else {
    document.getElementById('lobbyName').textContent = 'ID do Lobby não fornecido';
    document.getElementById('lobbyDescription').textContent = '';
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function comecarPartida(joinExistingGame = false) {
  const nomeUsuario = localStorage.getItem('usuarioLogado');
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');
  const LobbyDados = await dadoslobby(); // Aguarda a resolução da Promise e obtém os dados do lobby

  let Jogadores = [];
  
  for (let i = 0; i < 8; i++) {
    const jogadorId = i; // Gera um ID único para cada jogador
    const jogadorNome = LobbyDados.playerSlots[i]; // Obtém o nome do jogador do lobby
    const Objetivo = i;
    // Cria um objeto para representar o jogador com o ID e o nome
    const jogador = {
      id: jogadorId,
      nome: jogadorNome,
      objetivo: Objetivo
    };

    // Adiciona o jogador ao array Jogadores
    Jogadores.push(jogador);
  }

  LobbyDados.playerSlots = Jogadores;

  console.log("Jogadores2:");
  console.log(Jogadores);

  for(let i=0;i<8;i++){
  Jogadores[i] = LobbyDados.playerSlots[i] // Traz os nomes de usuarios
}
  let NumJogadores=0;

  for(let i=0;i<8;i++){
  if (Jogadores[i].nome != ''){
    NumJogadores++;
  }  
  }
  console.log("Numero de Jogadores"+NumJogadores); // Traz o numero de jogadores
  if (joinExistingGame) {
    const gameExistsResponse = await fetch(`https://45.140.193.150:8443/partida/${lobbyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    sleep(2000);

    if (gameExistsResponse.ok) {
      // Game exists, join the game
      // Implement logic for joining the existing game
      console.log('Game exists, joining game:', lobbyId);
      Entrarpartida(lobbyId);
      return; // Prevent creating a new game
    }
  }

  try {
      const response = await fetch('https://45.140.193.150:8443/partida', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: lobbyId, // Obter valor do campo de entrada
              nJogadores: NumJogadores,
              leaderId: LobbyDados.leaderId, // Criar validação de somente Admin criar partida
              lobbyName: `Partida de ${nomeUsuario}`,
              fase: "0",
              playerSlots: LobbyDados.playerSlots
              
          })
          
      });

      sleep(2000);

      if (!response.ok) {
          throw new Error('Erro ao criar lobby');
      }

      const data = await response.json();
      
      alert('Partida criada com sucesso! ID: ' + lobbyId);
      // $('#cadastroModal').modal('hide');

      // Redirecionar para a página do lobby com o ID na URL
      window.location.href = `/Partida/Partida.html?id=${lobbyId}`;
      console.log("Partida Criada...")
  } catch (error) {
      console.error('Erro ao criar partida:', error);
  }
}

async function voltarLobby(){
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');
  window.location.href = `/Partida/Partida.html?id=${lobbyId}`;

}

async function Entrarpartida(lobbyId)
{
window.location.href = `/Partida/Partida.html?id=${lobbyId}`;

}

async function dadoslobby() {
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');

  console.log("Lobby ID from URL:", lobbyId); // Log para verificar se o lobbyId está correto

  try {
    const response = await fetch('https://45.140.193.150:8443/lobbies', {
      method: 'GET',
    });
    sleep(2000);

    if (!response.ok) throw new Error('Erro ao buscar lobbies');

    const Lobs = await response.json();
    console.log("Lobbies recebidos:", Lobs); // Log para verificar os lobbies recebidos

    const LobbyExistente = Lobs.find(u => u.id === lobbyId);
    console.log("Lobby Existente:", LobbyExistente); // Log para verificar o lobby encontrado

    if (LobbyExistente) {
      // Carregar as informações do lobby em variáveis
      const id = LobbyExistente.id;
      const leaderId = LobbyExistente.leaderId;
      const lobbyName = LobbyExistente.lobbyName;
      const playerSlots = LobbyExistente.playerSlots;
      return { id, leaderId, lobbyName, playerSlots };


      // Chamar a função para exibir as informações no HTML
    } else {
      console.error('Lobby não encontrado');
      alert('Lobby não encontrado.');
      return null;

    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao achar dados do lobby.');
    return null;

  }
} 