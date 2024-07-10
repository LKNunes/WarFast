
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playersCores() {
  try {

    const urlParams = new URLSearchParams(window.location.search);
    const lobbyId = urlParams.get('id');

    const response = await fetch('https://45.140.193.150:8443/partida', {
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

async function dadospartida(lobbyId) {
  //const urlParams = new URLSearchParams(window.location.search);
  //const lobbyId = urlParams.get('id');
  

  //console.log("Lobby ID from URL:", lobbyId); // Log para verificar se o lobbyId está correto

  try {
    const response = await fetch('https://45.140.193.150:8443/partida', {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Erro ao buscar lobbies');

    const Lobs = await response.json();
    //console.log("Lobbies recebidos:", Lobs); // Log para verificar os lobbies recebidos

    const LobbyExistente = Lobs.find(u => u.id === lobbyId);

    //console.log("Lobbies recebidos:", LobbyExistente); // Log para verificar os lobbies recebidos


    if (LobbyExistente) {
      // Carregar as informações do lobby em variáveis
      const id = LobbyExistente.id;
      const leaderId = LobbyExistente.leaderId;
      const lobbyName = LobbyExistente.lobbyName;
      const fase = LobbyExistente.fase;
      const turno = LobbyExistente.turno;
      const playerSlots = LobbyExistente.playerSlots;
      return { id, leaderId, lobbyName, fase, turno, playerSlots };
      
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
    const response = await fetch(`https://45.140.193.150:8443/partida/${lobbyId}`, {
      method: 'PUT',
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

async function identificarTerritorios(svgObject) {
  console.log("Aguardando documento"+svgObject);
  const SVG = svgObject;
  //const svgObject = document.getElementById('svgObject');

  // Adicionar um ouvinte de evento para o carregamento do documento SVG
  SVG.addEventListener('load', function() {
    console.log("documento carregado");
    const svgDoc = SVG.contentDocument;
    const paths = svgDoc.getElementsByTagName('path'); // Selecionar todos os elementos <path>
    // Iterar sobre os elementos <path> e atribuir uma borda vermelha
    for (let i = 0; i < paths.length; i++) {
      // Adicionar uma borda vermelha
      console.log("For para Cor");
      paths[i].style.stroke = 'white';
      paths[i].style.strokeWidth = '0.5';

      // Chamar a função para alterar o tamanho do território ao passar o mouse sobre ele
      console.log("Função para Tamanho");
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
        console.log("DEntro da funçaõ tamanho");
        territorio.setAttribute('transform', 'scale(1.05) translate(' + deslocamentoX + ' ' + deslocamentoY + ')');
  });
      territorio.addEventListener('mouseleave', function() {
        this.setAttribute('transform', ''); // Restaurar o tamanho original
      });
    } 

    async function atribuirIDsNumericos() {
      const svgObject = document.getElementById('svgObject');

      try {

        const svgDoc =  loadSvg(svgObject);

        const paths = svgDoc.querySelectorAll('path'); // Selecionar todos os elementos <path>
        // Iterar sobre os elementos <path> e atribuir IDs numéricos
        paths.forEach((path, index) => {
          path.setAttribute('id', 'territorio' + (index + 1));
       //   console.log('ID do path:', path.getAttribute('id'));
        });

       // console.log('IDs numéricos atribuídos aos elementos <path>.');
      } catch (error) {
        console.error('Erro ao carregar o SVG:', error);
      }
    }

    function loadSvg(svgElement) {
      return new Promise((resolve, reject) => {
        svgElement.addEventListener('load', () => {
          const svgDoc = svgElement.contentDocument;
          if (svgDoc) {
            resolve(svgDoc);
          } else {
            reject(new Error("SVG não carregado corretamente."));
          }
        });

        svgElement.addEventListener('error', (event) => {
          reject(new Error("Erro ao carregar o SVG."));
        });
      });
    }
 
// Função para atribuir cores aos jogadores
function atribuirCores() {
  const cores = [
    'rgb(0, 128, 128)',
    'rgb(0, 255, 0)', // Verde
    'rgb(255, 255, 0)', // Amarelo
    'rgb(255, 0, 0)', // Vermelho
    'rgb(255, 0, 255)', // Rosa
    'rgb(255, 165, 0)', // Laranja
    'rgb(128, 128, 128)', // Cinza
    'rgb(128, 0, 128)'  // Roxo
  ];
  embaralharArray(cores);
  //console.log("Retornando Cores Função: atribuirCores()");
  return cores;
}

async function aplicarCores(lobbyId) {
  try {

    
    //console.log("Cores");
    const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

    //console.log("Dados Correto?" + PartidaDados.id);
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
    //  console.log(`Número ${i + 1} (Número ${distribuicao[jogador][Math.floor(i / 8)]}) está com o Jogador ${jogador + 1}`);
   //   console.log("Cor"+i+PartidaDados.playerSlots[jogador].cor);
      paths[i].style.fill = PartidaDados.playerSlots[jogador].cor;
      paths[i].style.stroke = 'white';
      paths[i].style.strokeWidth = '0.5';
      alterarTamanhoTerritorio(paths[i]);
    } 

    //console.log('Cores aplicadas aos territórios.');
  } catch (error) {
    console.error('Erro ao aplicar cores aos territórios:', error);
  }
}


async function CoresMain(lobbyId){
  const Fase = await Consultarfase(lobbyId);
  if ( Fase >= 1 ){
    return null;
  };


  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

      if (!PartidaDados) {
        console.error('Erro ao obter os dados da partida.');
        return;
      }

      const playersCor = await playersCores();
      if (!playersCor) {
        console.error('Erro ao obter os dados dos jogadores.');
        return;
      }

      const cores = atribuirCores();
      let Jogadores = [];

      for (let i = 0; i < PartidaDados.playerSlots.length; i++) {
        const jogadorId = PartidaDados.playerSlots[i].id;
        const jogadorNome = PartidaDados.playerSlots[i].nome;
        const Objetivo = PartidaDados.playerSlots[i].objetivo;
        const Cor = cores[i]; // Atribui a cor ao jogador
        
        // Cria um objeto para representar o jogador com o ID, nome e cor
        const jogador = {
          id: jogadorId,
          nome: jogadorNome,
          objetivo: Objetivo,
          cor: Cor
        };

        // Adiciona o jogador ao array Jogadores
        Jogadores.push(jogador);
      }

      // Atualiza os dados do lobby com os novos dados dos jogadores
      PartidaDados.playerSlots = Jogadores;
     
      // Atualiza o lobby no servidor
      await atualizarParcialmenteLobby(lobbyId, PartidaDados);
    
      // Aplicar cores aos territórios
      //await Atualizafase(lobbyId,1);

      //console.log("Jogadores atualizados:");
    
    
}

async function Consultarfase(lobbyId){
const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby 
// Consultar a fase atual da partida e retornar

return PartidaDados.fase;
}

async function Atualizafase(lobbyId, fase) {
  // Obter os dados da partida
  const PartidaDados = await dadospartida(lobbyId);

  // Verificar se o ID da partida corresponde
  if (PartidaDados.id === lobbyId) {
    // Atualizar o campo "fase"
    PartidaDados.fase = fase;
    console.log(JSON.stringify(PartidaDados, null, 2));
    console.log("Atualizando para fase"+fase+" :"+PartidaDados.fase);
    // Enviar os dados atualizados de volta para o servidor
    const response = await fetch(`https://45.140.193.150:8443/partida/${lobbyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(PartidaDados)
    });

   // console.log('Resposta do servidor:', response);

    if (!response.ok) {
      console.error(`Erro ao atualizar os dados: ${response.statusText}`);
      return;
    }

    // Obter a resposta e mostrar o JSON atualizado
    const updatedJson = await response.json();
    //console.log('JSON atualizado:', updatedJson);

    // Chamar a função Consultarfase para verificar a fase atualizada
   // console.log(lobbyId);
   // console.log( await Consultarfase(lobbyId));
  } else {
    console.error(`ID da partida ${lobbyId} não corresponde.`);
  }
}

async function ImprimirJogadores(lobbyId)
{
const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby 


      for(i=0;i<=7;i++){
        document.getElementById('nomeJogador'+i).textContent =  PartidaDados.playerSlots[i].id;
        const spanNomeJogador = document.getElementById('nomeJogador'+i);
        spanNomeJogador.style.color = PartidaDados.playerSlots[i].cor;
      }
    }
    
function atribuirObjetivos() {
  const Objetivos = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'
  ];
  embaralharArray(Objetivos);
  return Objetivos;
}
 

async function ObjetivoMain(lobbyId)
{
  const Fase = await Consultarfase(lobbyId);

  if ( Fase >= 1 ){
    return null;
  };
  console.log("Objetivo Main...");
    
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
  const ObjetivosAleatorios = atribuirObjetivos();
  let Jogadores = [];

  for (let i = 0; i < PartidaDados.playerSlots.length; i++) { //percorre a lista de jogadores
  //console.log(ObjetivosAleatorios[i]); 
  // Aqui... atribuir aleatoriamente os 16 objetivos aos 8 jogadores

    //teste
  
        const jogadorId = PartidaDados.playerSlots[i].id;
        const jogadorNome = PartidaDados.playerSlots[i].nome;
        const Objetivo = ObjetivosAleatorios[i];
        const Cor = PartidaDados.playerSlots[i].cor; // Atribui a cor ao jogador
        //console.log("J"+jogadorId+" Obj:"+Objetivo);

        // Cria um objeto para representar o jogador com o ID, nome e cor
        const jogador = {
          id: jogadorId,
          nome: jogadorNome,
          objetivo: Objetivo,
          cor: Cor
        };

        // Adiciona o jogador ao array Jogadores
        Jogadores.push(jogador);

  }
      PartidaDados.playerSlots = Jogadores;
      
   //   console.log(JSON.stringify(PartidaDados) + " DADOS");

      //teste
      await atualizarParcialmenteLobby(lobbyId, PartidaDados);
      await Atualizafase(lobbyId,1);

}

async function ExibeObjetivo(lobbyId,UsLogado) {
  try {

    const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
    
    for (i=0;i<=7;i++){
    if (PartidaDados.playerSlots[i].nome == UsLogado)
      {
      
        const objetivos = [
          { numero: 1, descricao: 'Conquistar a América do Norte' },
          { numero: 2, descricao: 'Conquistar a América do Sul' },
          { numero: 3, descricao: 'Conquistar a África' },
          { numero: 4, descricao: 'Conquistar a Europa' },
          { numero: 5, descricao: 'Conquistar a Ásia' },
          { numero: 6, descricao: 'Conquistar a Oceania' },
          { numero: 7, descricao: 'Conquistar 18 territórios' },
          { numero: 8, descricao: 'Conquistar 24 territórios' },
          { numero: 9, descricao: 'Conquistar 30 territórios' },
          { numero: 10, descricao: 'Conquistar 24 territórios e manter por 3 turnos' },
          { numero: 11, descricao: 'Conquistar 18 territórios e manter por 3 turnos' },
          { numero: 12, descricao: 'Destruir vermelho' },
          { numero: 13, descricao: 'Destruir azul' },
          { numero: 14, descricao: 'Destruir amarelo' },
          { numero: 15, descricao: 'Destruir verde' },
          { numero: 16, descricao: 'Destruir preto' }
        ];

      //document.getElementById('Objetivo').textContent =  PartidaDados.playerSlots[i].objetivo;
 
      document.getElementById('Objetivo').textContent = objetivos[i].descricao;  
 
      return PartidaDados.playerSlots[i].objetivo;
      }
    else{
      console.log("Usuario não encontrado");
    }
  }

    
  } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao autenticar usuário.');
  }
}

async function MostrarHTML(element){
  
  element.style.display = 'none';
}