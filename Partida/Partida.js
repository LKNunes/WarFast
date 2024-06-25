
async function playersCores() {
  try {

    const urlParams = new URLSearchParams(window.location.search);
    const lobbyId = urlParams.get('id');

    const response = await fetch('https://dbwar.onrender.com/partida', {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Erro ao buscar lobbies');

    const playersPartida = await response.json();
    //console.log("Lobbies recebidos:", playersPartida); // Log para verificar os lobbies recebidos

    const LobbyExistente = playersPartida.find(u => u.id === lobbyId);
    //console.log("Lobby Existente:", LobbyExistente); // Log para verificar o lobby encontrado

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

async function dadospartida() {
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('id');

  //console.log("Lobby ID from URL:", lobbyId); // Log para verificar se o lobbyId está correto

  try {
    const response = await fetch('https://dbwar.onrender.com/partida', {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Erro ao buscar lobbies');

    const Lobs = await response.json();
    //console.log("Lobbies recebidos:", Lobs); // Log para verificar os lobbies recebidos

    const LobbyExistente = Lobs.find(u => u.id === lobbyId);

   // console.log("Lobbies recebidos:", LobbyExistente); // Log para verificar os lobbies recebidos

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

async function atualizarParcialmenteLobby(lobbyId, atualizacoes) {
  try {
    const response = await fetch(`https://dbwar.onrender.com/partida/${lobbyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(atualizacoes)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar parcialmente o lobby');
    }

    const dadosAtualizados = await response.json();
//    console.log('Lobby atualizado parcialmente com sucesso:', dadosAtualizados);
  } catch (error) {
    console.error('Erro:', error);
  }
}

function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function identificarTerritorios() {
  const svgObject = document.getElementById('svgObject');

  // Adicionar um ouvinte de evento para o carregamento do documento SVG
  svgObject.addEventListener('load', function() {
    console.log("1");
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.getElementsByTagName('path'); // Selecionar todos os elementos <path>
      console.log("2");
    // Iterar sobre os elementos <path> e atribuir uma borda vermelha
    for (let i = 0; i < paths.length; i++) {
      // Adicionar uma borda vermelha
      paths[i].style.stroke = 'white';
      paths[i].style.strokeWidth = '0.5';
//      pausecomp(500);

      console.log("3");
      // Chamar a função para alterar o tamanho do território ao passar o mouse sobre ele
      alterarTamanhoTerritorio(paths[i]);
    }
  });
}

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}
    // Função para alterar o tamanho de um território ao passar o mouse sobre ele
    function alterarTamanhoTerritorio(territorio) {
      territorio.addEventListener('mouseenter', function() {
        const centroX = territorio.getBBox().x + territorio.getBBox().width / 2;
        const centroY = territorio.getBBox().y + territorio.getBBox().height / 2;
        const deslocamentoX = centroX - centroX * 1.05;
        const deslocamentoY = centroY - centroY * 1.05;
        
        territorio.setAttribute('transform', 'scale(1.05) translate(' + deslocamentoX + ' ' + deslocamentoY + ')');
  });
      territorio.addEventListener('mouseleave', function() {
        this.setAttribute('transform', ''); // Restaurar o tamanho original
      });
    } 

    async function atribuirIDsNumericos() {
      const svgObject = document.getElementById('svgObject');

      // Adicionar um ouvinte de evento para o carregamento do documento SVG
      svgObject.addEventListener('load', function() {
        const svgDoc = svgObject.contentDocument;
        const paths = svgDoc.querySelectorAll('path'); // Selecionar todos os elementos <path>

        // Iterar sobre os elementos <path> e atribuir IDs numéricos
        paths.forEach((path, index) => {
          path.setAttribute('id', 'territorio' + (index + 1));
          console.log('ID do path:', path.getAttribute('id'));
        });

        console.log('IDs numéricos atribuídos aos elementos <path>.');
      });
    }
 
// Função para atribuir cores aos jogadores
function atribuirCores() {
  const cores = [
    'rgb(0, 0, 255)', // Azul
    'rgb(0, 255, 0)', // Verde
    'rgb(255, 255, 0)', // Amarelo
    'rgb(255, 0, 0)', // Vermelho
    'rgb(255, 0, 255)', // Rosa
    'rgb(255, 165, 0)', // Laranja
    'rgb(255, 255, 255)', // Branco
    'rgb(128, 0, 128)'  // Roxo
  ];
  embaralharArray(cores);
  console.log("Retornando Cores Função: atribuirCores()");
  return cores;
}

async function aplicarCores() {
  try {

    const PartidaDados = await dadospartida(); // Aguarda a resolução da Promise e obtém os dados do lobby

    console.log("Dados Correto?" + PartidaDados.id);
    if (!PartidaDados) {
      console.error('Erro ao obter os dados da partida.');
      return;
    }

    const svgObject = document.getElementById('svgObject');
    const svgDoc = svgObject.contentDocument;

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path');

    //teste
    function distribuirNumerosAleatoriamente() {
      const numeros = Array.from({ length: 42 }, (_, i) => i + 1);
      
      // Função para embaralhar a array de números
      function embaralhar(array) {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }
      }
      
      // Embaralha os números
      embaralhar(numeros);
      
      const jogadores = Array.from({ length: 8 }, () => []);
      
      // Distribui os números embaralhados para os jogadores
      for (let i = 0; i < numeros.length; i++) {
          jogadores[i % 8].push(numeros[i]);
      }
      
      return jogadores;
  }
  
  // Exemplo de uso
  const distribuicao = distribuirNumerosAleatoriamente();  

    //teste

    for (let i = 0; i < 42; i++) {
      let jogador = i % 8;
      console.log(`Número ${i + 1} (Número ${distribuicao[jogador][Math.floor(i / 8)]}) está com o Jogador ${jogador + 1}`);
      console.log(PartidaDados.playerSlots[jogador+1].Cor);
     // paths[i+1].style.fill = PartidaDados.playerSlots[jogador+1].cor;
    }
    
  
    PartidaDados.playerSlots.forEach((player, index) => {
      const cor = player.cor;
      console.log("PLAYER" + player.id + " COR: " + player.cor);
      paths[index].style.fill = cor; // Aplica a cor ao território correspondente
      paths[index].style.stroke = cor;
    });

    console.log('Cores aplicadas aos territórios.');
  } catch (error) {
    console.error('Erro ao aplicar cores aos territórios:', error);
  }
}



