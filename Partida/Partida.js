const mapContainer = document.getElementById('mapContainer');

for (const territoryObject of territoryData) {
  const territory = document.createElement('div');
  territory.classList.add('territory');

  // Load the SVG image asynchronously
  fetch(territoryObject.imageURL)
    .then(response => response.text())
    .then(svgContent => {
      territory.innerHTML = svgContent;

      // Set absolute position based on coordinates
      territory.style.position = 'absolute';
      territory.style.left = territoryObject.x + 'px';
      territory.style.top = territoryObject.y + 'px';

      mapContainer.appendChild(territory);
    })
    .catch(error => console.error('Error loading SVG:', error));
}
// Obtém o ID do lobby da URL
const urlParams = new URLSearchParams(window.location.search);
const lobbyId = urlParams.get('id');

async function playersCores() {
  try {
    const response = await fetch('https://dbwar.onrender.com/partida', {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Erro ao buscar lobbies');

    const playersPartida = await response.json();
    console.log("Lobbies recebidos:", playersPartida); // Log para verificar os lobbies recebidos

    const LobbyExistente = playersPartida.find(u => u.id === lobbyId);
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
// Função para embaralhar um array
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para atribuir cores aleatoriamente aos jogadores
function atribuirCores() {
  const cores = [
    'rgb(255, 255, 0)',  // Amarelo
    'rgb(0, 128, 0)',    // Verde
    'rgb(255, 0, 0)',    // Vermelho
    'rgb(0, 0, 255)',    // Azul
    'rgb(255, 105, 180)',// Rosa
    'rgb(128, 0, 128)',  // Roxo
    'rgb(255, 255, 255)',// Branco
    'rgb(255, 165, 0)'   // Laranja
  ];

  // Embaralhar as cores
  embaralharArray(cores);
}