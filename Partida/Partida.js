
// Exemplo de uso:



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
      const territorios = LobbyExistente.territorios;
      
      return { id, leaderId, lobbyName, fase, turno, playerSlots, territorios };
      
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
        console.log("X "+centroX.toFixed(2)+",Y "+centroY.toFixed(2)+",ID"+territorio.id);
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

async function DestribuirTerritorios(lobbyId)
{
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
 
  const Fase = await Consultarfase(lobbyId);
  if ( Fase >= 1 ){
    return null;
  };
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

  console.log("Exemplo"+ distribuicao);


  //teste

  let Territorios = [];

  for (let i = 0; i < 42; i++) {
    let jogador = i % 8; // Determina o jogador atual (0-7)

    const TerritorioID = distribuicao[jogador][Math.floor(i / 8)] - 1
    const Dono =  jogador;

    const territorio = {
      id: TerritorioID,
      dono: Dono,
      tropas: 1
    };


    Territorios.push(territorio);
  }

  Territorios.sort((a, b) => a.id - b.id);

  console.log("Exemplo"+Territorios);
  // Atualiza os dados do lobby com os novos dados dos jogadores
 
  PartidaDados.territorios = Territorios;
 
  // Atualiza o lobby no servidor
  await atualizarParcialmenteLobby(lobbyId, PartidaDados);
  //Armazenar territorios no DB na primeira vez e chamar a função para aplicar as cores do DB no SVG
  await Atualizafase(lobbyId,1);

  return distribuicao;

}

async function aplicarCores(lobbyId) {
  try {
    // console.log("Cores");
    const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

    // console.log("Dados Correto?" + PartidaDados.id);
    if (!PartidaDados) {
      console.error('Erro ao obter os dados da partida.');
      return;
    }

    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    //const Territorios = await DestribuirTerritorios(lobbyId); // Aguarda a resolução da Promise que distribui os territórios
    const Territorios = PartidaDados.territorios;    

    for (let i = 0; i < 42; i++) { // Itera por 42 territórios
      
      nterritorio = Territorios[i].id 

      console.log(Territorios[i].id +"  "+nterritorio+" "+Territorios[i].dono)
      console.log(paths[i].id);
      paths[nterritorio].style.fill = PartidaDados.playerSlots[Territorios[i].dono].cor; // Aplica a cor do jogador ao território
      paths[nterritorio].style.stroke = 'white'; // Define a cor da borda do território
      paths[nterritorio].style.strokeWidth = '0.5'; // Define a largura da borda
      alterarTamanhoTerritorio(paths[nterritorio]); // Chama a função para alterar o tamanho do território

    } 

    // console.log('Cores aplicadas aos territórios.');
  } catch (error) {
    console.error('Erro ao aplicar cores aos territórios:', error); // Loga qualquer erro que ocorrer no processo
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

    if (!response.ok) {
      console.error(`Erro ao atualizar os dados: ${response.statusText}`);
      return;
    }

    // Obter a resposta e mostrar o JSON atualizado
    const updatedJson = await response.json();


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

}

async function ExibeObjetivo(lobbyId,UsLogado) {
  try {

    const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
    
    for (i=0;i<=7;i++){
    if (PartidaDados.playerSlots[i].nome == UsLogado)
      {
      
        const objetivos = [
          { numero: 1, descricao: 'Conquistar America do Norte e Africa'},
          { numero: 2, descricao: 'Conquistar Asia e Africa'},
          { numero: 3, descricao: 'Conquistar America do Norte e Oceania'},
          { numero: 4, descricao: 'Conquistar Europa Ameria do Sul e mais um à sua escolha' },
          { numero: 5, descricao: 'Conquistar Asia e America do Sul'},
          { numero: 6, descricao: 'Conquistar Europa, Oceania e mais um à sua escolha' },
          { numero: 7, descricao: 'Conquistar 18 territorios, com 2 tropas em cada pelo menos'},
          { numero: 8, descricao: 'Conquistar 24 territorios, a sua escolha' },
          { numero: 9, descricao: 'Destruir Cinza' },
          { numero: 10, descricao: 'Destruir Laraja' },
          { numero: 11, descricao: 'Destruir Roxo' },
          { numero: 12, descricao: 'Destruir Verde Escuro' },
          { numero: 13, descricao: 'Destruir Verde Claro' },
          { numero: 14, descricao: 'Destruir Roxo Escuro' },
          { numero: 15, descricao: 'Destruir Amarelo' },
          { numero: 16, descricao: 'Destruir Vermelho' }
        ];

      //document.getElementById('Objetivo').textContent =  PartidaDados.playerSlots[i].objetivo;
      const x = PartidaDados.playerSlots[i].objetivo-1;
      console.log(objetivos[x].numero);
      document.getElementById('Objetivo').textContent = objetivos[x].descricao;  

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

async function ExibeTurno(lobbyId){
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
  
    document.getElementById('TurnoAtual').textContent = PartidaDados.turno; 
}

async function AtualizaTurno(lobbyId,turno){
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
   
    if (PartidaDados.id === lobbyId) {
      // Atualizar o campo "fase"
      PartidaDados.turno = turno;
      console.log(JSON.stringify(PartidaDados, null, 2));
      console.log("Atualizando para turno"+turno+" :"+PartidaDados.turno);
      // Enviar os dados atualizados de volta para o servidor
      const response = await fetch(`https://45.140.193.150:8443/partida/${lobbyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(PartidaDados)
      });
  
      if (!response.ok) {
        console.error(`Erro ao atualizar os dados: ${response.statusText}`);
        return;
      }
  
      // Obter a resposta e mostrar o JSON atualizado
      const updatedJson = await response.json();
  
  
    } else {
      console.error(`ID da partida ${lobbyId} não corresponde.`);
    }

    document.getElementById('TurnoAtual').textContent = PartidaDados.turno;
}

async function VerificaTurno(lobbyId)
{
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
   
  console.log("Turno Verificado:"+PartidaDados.turno);
  return PartidaDados.turno;
}

async function ExibirTropas(lobbyId) {
  const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
  const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG
  const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

  const PartidaDados = await dadospartida(lobbyId); // Assume que a função dadospartida retorna um objeto com os dados da partida
  const territorios = PartidaDados.territorios; // Suponho que 'territorios' contém os dados dos territórios
  
  // Array com as coordenadas x e y para cada texto

  const Ajuste = 21;
  const coordenadasTextos = [
    
    { x: 66.45, y: 132.22-Ajuste },
    { x: 60.12, y: 154.46-Ajuste },
    { x: 56.88, y: 114.46-Ajuste },
    { x: 54.41, y: 130.52-Ajuste },
    { x: 39.05, y: 101.15-Ajuste },
    { x: 38.31, y: 83.57-Ajuste },
    { x: 36.65, y: 66.05-Ajuste },
    { x: 43.34, y: 50.82-Ajuste },
    { x: 19.66, y: 56.92-Ajuste },
    { x: 65.97, y: 69.37-Ajuste },
    { x: 182.87, y: 42.59-Ajuste },
    { x: 115.26, y: 52.55-Ajuste },
    { x: 180.36, y: 59.06-Ajuste },
    { x: 199.33, y: 53.97-Ajuste },
    { x: 165.10, y: 51.46-Ajuste },
    { x: 156.24, y: 54.95-Ajuste },
    { x: 113.39, y: 72.00-Ajuste },
    { x: 183.49, y: 72.77-Ajuste },
    { x: 134.09, y: 65.21-Ajuste },
    { x: 150.19, y: 77.82-Ajuste },
    { x: 114.96, y: 87.08-Ajuste },
    { x: 98.32, y: 88.36-Ajuste },
    { x: 176.02, y: 86.16-Ajuste },
    { x: 180.07, y: 107.85-Ajuste },
    { x: 137.36, y: 103.34-Ajuste },
    { x: 162.97, y: 103.30-Ajuste },
    { x: 51.08, y: 67.95-Ajuste },
    { x: 53.52, y: 85.85-Ajuste },
    { x: 76.71, y: 42.48-Ajuste },
    { x: 97.05, y: 54.27-Ajuste },
    { x: 122.93, y: 107.77-Ajuste },
    { x: 107.77, y: 113.83-Ajuste },
    { x: 122.30, y: 132.08-Ajuste },
    { x: 133.97, y: 128.68-Ajuste },
    { x: 125.50, y: 149.48-Ajuste },
    { x: 188.31, y: 158.26-Ajuste },
    { x: 208.02, y: 138.14-Ajuste },
    { x: 209.88, y: 76.33-Ajuste },
    { x: 173.73, y: 134.79-Ajuste },
    { x: 189.87, y: 124.29-Ajuste },
    { x: 145.07, y: 154.65-Ajuste },
    { x: 87.52, y: 69.71-Ajuste }
// Adicione mais coordenadas conforme necessário
  ];
  
  console.log(territorios);


  paths.forEach(function(path, i) {
    // Obtém as coordenadas para o texto
    const coords = coordenadasTextos[i];
    // Cria um elemento de texto
    var text = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Define a posição do texto com base nas coordenadas informadas
    text.setAttribute('x', coords.x);
    text.setAttribute('y', coords.y);

    // Adiciona o texto do número do dono do território
    text.textContent = territorios[i].id;
    // Define o tamanho da fonte do texto
    text.style.fontSize = '5px'; // Ajuste o tamanho da fonte conforme necessário
    text.style.fontFamily = 'Fantasia, Arial, sans-serif';
    text.style.letterSpacing = '0.5px'; // Ajuste o espaçamento entre letras conforme necessário
    text.style.textAlign = 'center'; // Alinhe o texto conforme necessário
    text.style.fill = '#ffffff'; // Cor do texto, substitua pela cor desejada
    text.style.fontWeight = 'normal';
    text.style.stroke = '#000000'; // Cor da borda do texto
    text.style.strokeWidth = '0.3px'; // Largura da borda do texto
    
    // Ajuste a posição do texto para centralizar melhor
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');

    // Adiciona o texto ao SVG
    svgDoc.documentElement.appendChild(text);
  });
}

