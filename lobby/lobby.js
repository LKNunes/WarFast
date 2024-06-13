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
          document.getElementById('lobbyId').textContent = `ID: ${lobby.id}`;
          document.getElementById('lobbyDescription').textContent = lobby.playerSlots;

          // Lista os jogadores
          const playersList = document.getElementById('playersList');
          playersList.innerHTML = ''; // Clear any previous content
          lobby.players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${player.name} (Score: ${player.score})`;
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
