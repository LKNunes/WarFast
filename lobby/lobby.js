document.addEventListener('DOMContentLoaded', function() {
  // Obtém o ID do lobby da URL
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');

  console.log('Lobby ID from URL:', lobbyId); // Debug: Check if lobby ID is being retrieved

  if (lobbyId) {
    // Faz uma requisição para obter os dados do db.json
    fetch('https://dbwar.onrender.com/lobbies')
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

async function comecarPartida() {
  const nomeUsuario = localStorage.getItem('usuarioLogado');
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');

  if (joinExistingGame) {
    const gameExistsResponse = await fetch(`https://dbwar.onrender.com/partida/${lobbyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (gameExistsResponse.ok) {
      // Game exists, join the game
      // Implement logic for joining the existing game
      console.log('Game exists, joining game:', lobbyId);
      Entrarpartida(lobbyId);
      return; // Prevent creating a new game
    }
  }

  try {
      const response = await fetch('https://dbwar.onrender.com/partida', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: lobbyId, // Obter valor do campo de entrada
              leaderId: nomeUsuario,
              lobbyName: `Lobby de ${nomeUsuario}`,
              playerSlots: ['', '', '', '', '', '', '', '']
          })
      });



      if (!response.ok) {
          throw new Error('Erro ao criar lobby');
      }

      const data = await response.json();
      
      alert('Lobby criado com sucesso! ID: ' + lobbyId);
      // $('#cadastroModal').modal('hide');

      // Redirecionar para a página do lobby com o ID na URL
      window.location.href = `/Partida/Partida.html?id=${lobbyId}`;

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