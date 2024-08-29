
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

    console.log("Lobbies recebidos:", LobbyExistente); // Log para verificar os lobbies recebidos


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
  console.log("Aguardando documento" + svgObject);
  const SVG = svgObject;
  //const svgObject = document.getElementById('svgObject');

  // Adicionar um ouvinte de evento para o carregamento do documento SVG
  SVG.addEventListener('load', function () {
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

function pausecomp(millis) {
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while (curDate - date < millis);
}



// Função para alterar o tamanho de um território ao passar o mouse sobre ele
function alterarTamanhoTerritorio(territorio) {
  territorio.addEventListener('mouseenter', function () {
    const centroX = territorio.getBBox().x + territorio.getBBox().width / 2;
    const centroY = territorio.getBBox().y + territorio.getBBox().height / 2;
    const deslocamentoX = centroX - centroX * 1.05;
    const deslocamentoY = centroY - centroY * 1.05;

    // console.log("DEntro da funçaõ tamanho");
    territorio.setAttribute('transform', 'scale(1.05) translate(' + deslocamentoX + ' ' + deslocamentoY + ')');
    // console.log("X "+centroX.toFixed(2)+",Y "+centroY.toFixed(2)+",ID"+territorio.id);
  });
  territorio.addEventListener('mouseleave', function () {
    this.setAttribute('transform', ''); // Restaurar o tamanho original
  });
}

async function atribuirIDsNumericos() {
  const svgObject = document.getElementById('svgObject');

  try {

    const svgDoc = loadSvg(svgObject);
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

async function DestribuirTerritorios(lobbyId) {
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  const Fase = await Consultarfase(lobbyId);
  if (Fase >= 1) {
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

  console.log("Exemplo" + distribuicao);


  //teste

  let Territorios = [];

  for (let i = 0; i < 42; i++) {
    let jogador = i % 8; // Determina o jogador atual (0-7)

    const TerritorioID = distribuicao[jogador][Math.floor(i / 8)] - 1
    const Dono = jogador;

    const territorio = {
      id: TerritorioID,
      dono: Dono,
      tropas: 1
    };


    Territorios.push(territorio);
  }

  Territorios.sort((a, b) => a.id - b.id);

  console.log("Exemplo" + Territorios);
  // Atualiza os dados do lobby com os novos dados dos jogadores

  PartidaDados.territorios = Territorios;

  // Atualiza o lobby no servidor
  await atualizarParcialmenteLobby(lobbyId, PartidaDados);
  //Armazenar territorios no DB na primeira vez e chamar a função para aplicar as cores do DB no SVG
  await Atualizafase(lobbyId, 1);

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

      //console.log(Territorios[i].id + "  " + nterritorio + " " + Territorios[i].dono)
      //console.log(paths[i].id);
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



async function CoresMain(lobbyId) {
  const Fase = await Consultarfase(lobbyId);
  if (Fase >= 1) {
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

async function Consultarfase(lobbyId) {
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
    // console.log(JSON.stringify(PartidaDados, null, 2));
    console.log("Atualizando para fase" + fase + " :" + PartidaDados.fase);
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

async function ImprimirJogadores(lobbyId) {
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby 


  for (i = 0; i <= 7; i++) {
    document.getElementById('nomeJogador' + i).textContent = PartidaDados.playerSlots[i].id;
    const spanNomeJogador = document.getElementById('nomeJogador' + i);
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


async function ObjetivoMain(lobbyId) {
  const Fase = await Consultarfase(lobbyId);

  if (Fase >= 1) {
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

async function ExibeObjetivo(lobbyId, UsLogado) {
  try {

    const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

    for (i = 0; i <= 7; i++) {
      if (PartidaDados.playerSlots[i].nome == UsLogado) {

        const objetivos = [
          { numero: 1, descricao: 'Conquistar America do Norte e Africa' },
          { numero: 2, descricao: 'Conquistar Asia e Africa' },
          { numero: 3, descricao: 'Conquistar America do Norte e Oceania' },
          { numero: 4, descricao: 'Conquistar Europa Ameria do Sul e mais um à sua escolha' },
          { numero: 5, descricao: 'Conquistar Asia e America do Sul' },
          { numero: 6, descricao: 'Conquistar Europa, Oceania e mais um à sua escolha' },
          { numero: 7, descricao: 'Conquistar 18 territorios, com 2 tropas em cada pelo menos' },
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
        const x = PartidaDados.playerSlots[i].objetivo - 1;
        //   console.log(objetivos[x].numero);
        document.getElementById('Objetivo').textContent = objetivos[x].descricao;

        return PartidaDados.playerSlots[i].objetivo;
      }
      else {
        console.log("Usuario não encontrado");
      }
    }


  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao autenticar usuário.');
  }
}

async function MostrarHTML(element) {

  element.style.display = 'none';
}

async function ExibeTurno(lobbyId) {
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
  //console.log("Turno Atual: "+PartidaDados.turno);
  document.getElementById('TurnoAtual').textContent = PartidaDados.turno;
}

async function AtualizaTurno(lobbyId, turno) {
  // Obter os dados da partida
  console.log("Atualizando para turno" + turno);

  const PartidaDados = await dadospartida(lobbyId);

  // Verificar se o ID da partida corresponde
  if (PartidaDados.id === lobbyId) {
    // Atualizar o campo "fase"
    PartidaDados.turno = turno;
    //console.log(JSON.stringify(PartidaDados, null, 2));
    console.log("Atualizando para turno" + turno + " :" + PartidaDados.turno);
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

async function VerificaTurno(lobbyId) {
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  console.log("Turno Verificado:" + PartidaDados.turno);
  return PartidaDados.turno;
}

async function ExibirTropas(lobbyId) {
  const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
  const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG
  const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

  const PartidaDados = await dadospartida(lobbyId); // Assume que a função dadospartida retorna um objeto com os dados da partida
  const territorios = PartidaDados.territorios; // Suponho que 'territorios' contém os dados dos territórios

  // Array com as coordenadas x e y para cada texto

  const coordenadasTextos = [

    { x: 69, y: 106 }, // 0
    { x: 58, y: 125 }, //1
    { x: 51, y: 90 }, //2
    { x: 54, y: 110 }, //3
    { x: 39, y: 81 }, //4
    { x: 36, y: 60 }, //5
    { x: 35, y: 43 }, //6
    { x: 40, y: 31 }, //7
    { x: 17, y: 32 }, //8
    { x: 64, y: 45 }, //9
    { x: 181, y: 18 }, //10
    { x: 110, y: 32 }, //11
    { x: 177, y: 39 }, //12
    { x: 199, y: 20 }, //13
    { x: 165, y: 27 }, //14
    { x: 153, y: 34 }, //15
    { x: 112, y: 49 }, //16
    { x: 181, y: 52 }, //17
    { x: 131, y: 45 }, //18
    { x: 150, y: 56 },  //19
    { x: 113, y: 62 }, //20
    { x: 96, y: 70 }, //21
    { x: 176, y: 66 }, //22
    { x: 178, y: 82 }, //23
    { x: 137, y: 83 }, //24
    { x: 162, y: 78 }, //25
    { x: 49, y: 45 }, //26
    { x: 53, y: 63 }, //27
    { x: 76, y: 17 }, //28 
    { x: 95.5, y: 31 }, //29
    { x: 121, y: 85 }, //30
    { x: 103, y: 90 }, //31
    { x: 121, y: 109 }, //32
    { x: 130, y: 100 }, //33
    { x: 122, y: 128 }, //34
    { x: 187, y: 135 }, //35
    { x: 208, y: 115 }, //36
    { x: 209, y: 56 }, //37
    { x: 173, y: 114 }, //38
    { x: 189, y: 104 }, //39
    { x: 143, y: 132 }, //40
    { x: 89, y: 49 } //41
    // Adicione mais coordenadas conforme necessário
  ];

  //console.log(territorios);

  const textosExistentes = svgDoc.querySelectorAll('text');
  textosExistentes.forEach(text => text.remove());

  paths.forEach(function (path, i) {
    // Obtém as coordenadas para o texto
    const coords = coordenadasTextos[i];
    // Cria um elemento de texto
    var text = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Define a posição do texto com base nas coordenadas informadas
    text.setAttribute('x', coords.x);
    text.setAttribute('y', coords.y);

    // Adiciona o texto do número do dono do território
    text.textContent = territorios[i].tropas;
    // Define o tamanho da fonte do texto
    text.style.fontSize = '5px'; // Ajuste o tamanho da fonte conforme necessário
    text.style.fontFamily = 'Arial, sans-serif';
    text.style.letterSpacing = '0.5px'; // Ajuste o espaçamento entre letras conforme necessário
    text.style.textAlign = 'center'; // Alinhe o texto conforme necessário
    text.style.fill = '#ffffff'; // Cor do texto, substitua pela cor desejada
    text.style.fontWeight = 'normal';
    text.style.stroke = '#000000'; // Cor da borda do texto
    text.style.strokeWidth = '0.1px'; // Largura da borda do texto
    text.style.cursor = "default"; // Remove cursor de texto
    text.style.pointerEvents = "none"; // Ignora o objeto de texto


    // Ajuste a posição do texto para centralizar melhor
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');

    // Adiciona o texto ao SVG
    svgDoc.documentElement.appendChild(text);
  });
}

async function turnofase1(lobbyId) {
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  const Fase = await Consultarfase(lobbyId);
  const Turno = PartidaDados.turno;

  if (Fase >= 2) {
    return null;
  };
  console.log("If -1 = " + Turno);

  if (Fase == 1 && Turno == -1) {

    let Jogadores = [];
    let QuantidadeTropasJ = [
      { id: 0, tropas: 0 },
      { id: 1, tropas: 0 },
      { id: 2, tropas: 0 },
      { id: 3, tropas: 0 },
      { id: 4, tropas: 0 },
      { id: 5, tropas: 0 },
      { id: 6, tropas: 0 },
      { id: 7, tropas: 0 },
    ];
    for (i = 0; i < 8; i++) {
      // Liberar tropas de acordo com numero de terrtorios dividido por 2 Ex: Se 7 Territorios 3 tropas.

      for (i = 0; i < 8; i++) {
        for (j = 0; j < 42; j++) {
          if (PartidaDados.territorios[j].dono == i) {
            QuantidadeTropasJ[i].tropas = QuantidadeTropasJ[i].tropas + 1;

          }
        }
      }

      for (let i = 0; i < PartidaDados.playerSlots.length; i++) {
        const jogadorId = PartidaDados.playerSlots[i].id;
        const jogadorNome = PartidaDados.playerSlots[i].nome;
        const Objetivo = PartidaDados.playerSlots[i].objetivo;
        const Cor = PartidaDados.playerSlots[i].cor; // Atribui a cor ao jogador
        const Tropas = Math.floor(QuantidadeTropasJ[i].tropas / 2); // Dividde por 2 arredonda
        console.log("Tropas: " + QuantidadeTropasJ[i]);

        // Cria um objeto para representar o jogador com o ID, nome e cor
        const jogador = {
          id: jogadorId,
          nome: jogadorNome,
          objetivo: Objetivo,
          cor: Cor,
          tropas: Tropas
        };

        // Adiciona o jogador ao array Jogadores
        Jogadores.push(jogador);
      }

      // Atualiza os dados do lobby com os novos dados dos jogadores

    }

    PartidaDados.playerSlots = Jogadores;
    PartidaDados.turno = PartidaDados.turno + 1;

    await atualizarParcialmenteLobby(lobbyId, PartidaDados);

  };
  // Ate aqui logica para atualizar o DB com as tropas disponiveis 
  // Apartir daqui logica para destribuir tropas

  // Função que destaca o path clicado e desfoca os outros

  async function removerEventListeners() {
    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    paths.forEach(path => {
      path.removeEventListener('click', handleClick);
    });
    console.log("Removido os Eventos");
  }



  // Função para remover event listeners de todos os paths
  function removerEventListeners(handleClick) {

    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    paths.forEach(path => {
      path.removeEventListener('click', handleClick);
    });
  }

  function EsperaClick() {
    return new Promise(resolve => {
      const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
      const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

      if (!svgDoc) {
        console.error('Erro ao acessar o conteúdo do documento SVG.');
        resolve(null); // Resolve com null em caso de erro
        return;
      }

      const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

      function handleClick(event) {
        const clickedPath = event.target;
        console.log('Path clicado:', clickedPath.getAttribute('inkscape:label')); // Mostra no console o ID do path clicado
        const PathA = clickedPath.getAttribute('inkscape:label').slice(4).match(/\d+/)[0];
        // paths[PathA-1].style.opacity = '0.3';

        // Remove o event listener deste path após o clique
        removerEventListeners(handleClick);

        // Resolve a Promise com o path clicado
        resolve(clickedPath);
      }

      paths.forEach(path => {
        path.addEventListener('click', handleClick, { once: true }); // Adiciona o event listener para um único clique
      });
    });
  }

  function mostrarInput() {
    // Mostra o container de input
    document.getElementById('inputContainer').classList.remove('hidden');
  }

  function esconderInput() {
    // Esconde o container de input e limpa o valor do input
    document.getElementById('inputContainer').classList.add('hidden');
    document.getElementById('numeroInput').value = ''; // Limpa o input
  }

  function esperarInput() {
    return new Promise((resolve) => {
      // Cria uma nova promessa que será resolvida quando o input for processado
      const submitBtn = document.getElementById('submitBtn'); // Botão de submissão
      const numeroInput = document.getElementById('numeroInput'); // Campo de input

      async function processarInput() {
        // Processa o input do usuário
        const numero = parseInt(numeroInput.value, 10); // Converte o valor do input para um número inteiro

        if (isNaN(numero)) {
          // Se o valor não for um número válido, exibe um alerta
          alert("Por favor, insira um número válido.");
          return;
        }

        if (numero <= 0) {
          // Se o valor não for um número válido, exibe um alerta
          alert("Por favor, insira um número válido.");
          return;
        }

        const PartidaDados3 = await dadospartida(lobbyId); // Assume que a função dadospartida retorna um objeto com os dados da partida

        if (numero > PartidaDados3.playerSlots[PartidaDados3.turno].tropas) {
          // Se o valor for maior que as tropas disponiveis, exibe um alerta
          alert("Tropas restantes:" + PartidaDados3.playerSlots[PartidaDados3.turno].tropas);
          return;
        }

        resolve(numero); // Resolve a promessa com o número inserido
        esconderInput(); // Esconde o input
        await ExibirTropas(lobbyId); // Lentrete( Criar função para atualizar tropas no mapa essa cria mais elementos de texto sobrepostos)
        // Remove o event listener após a resolução da promessa
        submitBtn.removeEventListener('click', processarInput);
      }

      // Adiciona um event listener para o botão de submissão
      submitBtn.addEventListener('click', processarInput);
    });
  }


  async function atualizarTropasJogador(partidaDados, idJogador, novasTropas) {
    const jogador = partidaDados.playerSlots.find(jogador => jogador.id === idJogador);
    if (jogador) {
      jogador.tropas = novasTropas;

      const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados)
        });
        if (response.ok) {
          console.log(`Tropas do jogador ${idJogador} atualizadas para ${novasTropas}`);
        } else {
          console.error(`Erro ao atualizar a partida: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    } else {
      console.error(`Jogador com ID ${idJogador} não encontrado.`);
    }
  }

  // Função para atualizar as tropas de um território por ID
  async function atualizarTropasTerritorio(partidaDados, idPartida, territorioId, novoNumeroTropas) {
    try {
      // Encontrar o território na lista de territórios da partida
      const territorio = partidaDados.territorios.find(territorio => territorio.id === territorioId);

      if (territorio) {
        // Atualizar as tropas do território encontrado
        territorio.tropas = novoNumeroTropas;

        // Montar a URL para a requisição PUT
        const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;

        // Fazer a requisição PUT para atualizar a partida
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados) // Enviar toda a partida com o território modificado
        });

        // Verificar se a requisição foi bem-sucedida
        if (response.ok) {
          console.log(`Tropas do território ${territorioId} atualizadas para ${novoNumeroTropas}`);
        } else {
          console.error(`Erro ao atualizar tropas do território ${territorioId}: ${response.status} - ${response.statusText}`);
          throw new Error(`Erro ao atualizar tropas do território ${territorioId}`);
        }
      } else {
        console.error(`Território com ID ${territorioId} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar tropas do território:', error.message);
      throw error;
    }
  }

  async function rodadaDeJogadores(lobbyId, PartidaDados2) {
    // Função assíncrona que gerencia a rodada de jogadores
    // console.log("Vez do Jogador: " + PartidaDados.playerSlots[i].id); // Exibe o ID do jogador atual no console

    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    while (PartidaDados2.playerSlots[i].tropas > 0) { // Distribuir ate zerar as tropas
      PartidaDados2 = await dadospartida(lobbyId);
      for (j = 0; j < 42; j++) {
        if (PartidaDados.territorios[j].dono != i) { // Somente tira a opacidade dos que não são donos

          if (!svgDoc) {
            console.error('Erro ao acessar o conteúdo do documento SVG.');
            return;
          }

          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '0.5';
            paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
          }

        }

      }


      console.log("Roda1");

      let Territorio1 = await EsperaClick();

      console.log("Territorio Selecionado");
      // let Territorio2 = await EsperaClick();
      removerEventListeners();

      Territorio1 = parseInt(Territorio1.getAttribute('inkscape:label').slice(4).match(/\d+/)[0])
      // Territorio2 = Territorio2.getAttribute('inkscape:label').slice(4).match(/\d+/)[0]


      console.log("Identificação:" + Territorio1);

      //console.log("Tropas"+PartidaDados2.playerSlots[i].tropas);



      mostrarInput(); // Mostra o input para o jogador
      const numero = await esperarInput(); // Espera o jogador inserir um número


      console.log("Número inserido pelo jogador " + PartidaDados.playerSlots[i].id + ": " + numero); // Exibe o número inserido pelo jogador no console


      for (j = 0; j < 42; j++) {

        paths[j].style.opacity = '1.0';
        paths[j].style.pointerEvents = "auto"; // Ignora o objeto

        console.log("teste");
      }

      TropasJogador = PartidaDados2.playerSlots[i].tropas - numero;
      NovaTropasTerritorio = PartidaDados2.territorios[Territorio1 - 1].tropas + numero;

      await atualizarTropasJogador(PartidaDados2, i, TropasJogador); // Atualiza as tropas do jogador com ID 0 para 5
      //          console.log("Objeto:"+PartidaDados2.territorios[Territorio1].id+" "+Territorio1+" "+numero+"");
      await atualizarTropasTerritorio(PartidaDados2, lobbyId, Territorio1 - 1, NovaTropasTerritorio); // Atualiza as tropas do território com ID 2 para 10   

      console.log("Atualizar Turno...");


    }
    await AtualizaTurno(PartidaDados2.id, PartidaDados2.turno + 1);

  }

  for (i = PartidaDados.turno; i < 8; i++) { // Looping da Vez do Jogador

    console.log("Vez do Jogador:" + PartidaDados.playerSlots[i].id); // Exibe o ID do jogador atual no console 

    var PartidaDados2 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby


    // Inicia a sequência chamando rodadaDeJogadores()
    await rodadaDeJogadores(lobbyId, PartidaDados2); // Espera a função assíncrona finalizar antes de continuar o loop


    if (PartidaDados2.turno >= 8) {
      await AtualizaTurno(PartidaDados2.id, 0);
      await Atualizafase(lobbyId, 2);
      return;
    }
  }
  console.log("Todos os jogadores inseriram seus números."); // Exibe no console que todos os jogadores inseriram seus números

  var PartidaDados4 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  if (PartidaDados4.turno >= 8) {
    await AtualizaTurno(PartidaDados4.id, -1);
    await Atualizafase(lobbyId, 2); // Comentar essa linha para testar roda1 infinita.  
    return;
  }

  console.log("...Final do turno teste"); // Exibe uma mensagem indicando o final do turno

  // Finalizar turno, proximo jogador.

}

async function turnofase2acima(lobbyId) {
  // 1 - Liberar tropas de acordo com numero de terrtorios dividido por 2 Ex: Se 7 Territorios 3 tropas.
  // console.log("Fase 2 - Função");
  const PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  const Fase = await Consultarfase(lobbyId);
  const Turno = PartidaDados.turno;


  if (Fase <= 1) { // Quebra a função caso esteja na fase menor que 1
    return null;
  };

  if (Fase >= 2 && Turno == -1) { // So distribui as tropas no turno 0. Verificar se no Turno 0 não aplica mais de 1 vez as tropas. 

    let Jogadores = [];
    let QuantidadeTropasJ = [
      { id: 0, tropas: 0 },
      { id: 1, tropas: 0 },
      { id: 2, tropas: 0 },
      { id: 3, tropas: 0 },
      { id: 4, tropas: 0 },
      { id: 5, tropas: 0 },
      { id: 6, tropas: 0 },
      { id: 7, tropas: 0 },
    ];
    for (i = 0; i < 8; i++) {
      // Liberar tropas de acordo com numero de terrtorios dividido por 2 Ex: Se 7 Territorios 3 tropas.

      for (i = 0; i < 8; i++) {
        for (j = 0; j < 42; j++) {
          if (PartidaDados.territorios[j].dono == i) {
            QuantidadeTropasJ[i].tropas = QuantidadeTropasJ[i].tropas + 1;

          }
        }
      }

      for (let i = 0; i < PartidaDados.playerSlots.length; i++) {
        const jogadorId = PartidaDados.playerSlots[i].id;
        const jogadorNome = PartidaDados.playerSlots[i].nome;
        const Objetivo = PartidaDados.playerSlots[i].objetivo;
        const Cor = PartidaDados.playerSlots[i].cor; // Atribui a cor ao jogador
        const Tropas = Math.floor(QuantidadeTropasJ[i].tropas / 2); // Dividde por 2 arredonda
        console.log("Tropas: " + QuantidadeTropasJ[i]);

        // Cria um objeto para representar o jogador com o ID, nome e cor
        const jogador = {
          id: jogadorId,
          nome: jogadorNome,
          objetivo: Objetivo,
          cor: Cor,
          tropas: Tropas
        };

        // Adiciona o jogador ao array Jogadores
        Jogadores.push(jogador);
      }

      // Atualiza os dados do lobby com os novos dados dos jogadores

    }

    PartidaDados.playerSlots = Jogadores;
    PartidaDados.turno = PartidaDados.turno + 1;
    await atualizarParcialmenteLobby(lobbyId, PartidaDados);
  };

  //1 fim
  // 2 - Distribuir tropas

  async function removerEventListeners() {
    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    paths.forEach(path => {
      path.removeEventListener('click', handleClick);
    });
    console.log("Removido os Eventos");
  }

  // Função para remover event listeners de todos os paths
  function removerEventListeners(handleClick) {

    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    if (!svgDoc) {
      console.error('Erro ao acessar o conteúdo do documento SVG.');
      return;
    }

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    paths.forEach(path => {
      path.removeEventListener('click', handleClick);
    });
  }

  function EsperaClick(botaoId) {
    return new Promise((resolve) => {
      const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
      const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

      if (!svgDoc) {
        console.error('Erro ao acessar o conteúdo do documento SVG.');
        resolve(null); // Resolve com null em caso de erro
        return;
      }

      const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

      function handleClick(event) {
        const clickedPath = event.target;
        console.log('Path clicado:', clickedPath.getAttribute('inkscape:label'));

        // Remove o event listener deste path após o clique
        removerEventListeners(handleClick);

        // Resolve a Promise com o path clicado
        resolve(clickedPath);
      }

      function handleButtonClick() {
        console.log('Botão clicado, interrompendo espera de clique no path.');

        // Remove todos os event listeners dos paths
        removerEventListeners(handleClick);

        // Resolve a Promise com null ou algum valor que identifique o clique do botão
        resolve(null);
      }

      function removerEventListeners(handler) {
        paths.forEach(path => {
          path.removeEventListener('click', handler);
        });
      }

      // Adiciona o event listener para um único clique nos paths
      paths.forEach(path => {
        path.addEventListener('click', handleClick, { once: true });
      });

      // Adiciona o event listener no botão
      const botao = document.getElementById(botaoId);
      if (botao) {
        botao.addEventListener('click', handleButtonClick, { once: true });
      } else {
        console.error('Botão não encontrado.');
      }
    });
  }

  function rolarDados(numDados) {
    let resultados = [];
    for (let i = 0; i < numDados; i++) {
      resultados.push(Math.floor(Math.random() * 6) + 1);
    }
    return resultados.sort((a, b) => b - a);
  }

  function simularAtaque(atacanteUnidades, defensorUnidades) {
    // O atacante pode usar até 3 dados, mas só se tiver mais de 3 unidades
    let dadosAtaque = Math.min(3, atacanteUnidades - 1);

    // O defensor pode usar até 3 dados, mas só se tiver 3 ou mais unidades
    let dadosDefesa = Math.min(3, defensorUnidades);

    // Rolando os dados
    let ataqueResultados = rolarDados(dadosAtaque);
    let defesaResultados = rolarDados(dadosDefesa);

    console.log("Atacante rolou: " + ataqueResultados);
    console.log("Defensor rolou: " + defesaResultados);

    // Comparando os resultados
    let perdasAtacante = 0;
    let perdasDefensor = 0;

    for (let i = 0; i < Math.min(dadosAtaque, dadosDefesa); i++) {
      if (ataqueResultados[i] > defesaResultados[i]) {
        perdasDefensor++;
      } else {
        perdasAtacante++;
      }
    }

    console.log("Atacante perdeu " + perdasAtacante + " unidades.");
    console.log("Defensor perdeu " + perdasDefensor + " unidades.");

    return {
      perdasAtacante: perdasAtacante,
      perdasDefensor: perdasDefensor
    };
  }

  async function RemajenarTerritorio(lobbyId, PartidaDados4, botaoId) {

    while (!pararLoop2) {

      esperarCliqueBotao2('FinalizarBTN');

      console.log("i =" + i);

      const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
      const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

      const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
        }
      }

      var PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

      for (j = 0; j < 42; j++) {
        if (PartidaDados.territorios[j].dono != i) { // Somente tira a opacidade dos que não são donos

          if (!svgDoc) {
            console.error('Erro ao acessar o conteúdo do documento SVG.');
            return;
          }

          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '0.5';
            paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
          }

        }

      }

      let Territorio1 = await EsperaClick('FinalizarBTN');

      if (pararLoop2) {
        console.log("O loop foi interrompido pelo clique no botão.");

        for (j = 0; j < 42; j++) {
          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
            paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
          }
        }
        pararLoop2 = false;
        break;
      }

      Territorio1 = parseInt(Territorio1.getAttribute('inkscape:label').slice(4).match(/\d+/)[0]) - 1;

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
        }
      }

      for (j = 0; j < 42; j++) {
        if (PartidaDados.territorios[j].dono != i) { // Somente tira a opacidade dos que não são donos

          if (!svgDoc) {
            console.error('Erro ao acessar o conteúdo do documento SVG.');
            return;
          }

          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];
            console.log('Aqui deveria mostrar todos do dono')
            paths[PathA - 1].style.opacity = '0.5';
            paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
          }

        }

      }
      let Territorio2 = await EsperaClick('FinalizarBTN');

      if (pararLoop2) {
        console.log("O loop foi interrompido pelo clique no botão.");

        for (j = 0; j < 42; j++) {
          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
            paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
          }
        }
        pararLoop2 = false;
        break;
      }

      Territorio2 = parseInt(Territorio2.getAttribute('inkscape:label').slice(4).match(/\d+/)[0]) - 1;

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
        }
      }

      if (pararLoop2) {
        console.log("O loop foi interrompido pelo clique no botão.");
        break;
      }

      var PartidaDados5 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

      mostrarInput(); // Mostra o input para o jogador

      const quantidadetropas = await esperarInputremanejamento(Territorio1, Territorio2); // Espera o jogador inserir um número

      esconderInput()

      await Remanejar(PartidaDados5, lobbyId, Territorio1, Territorio2, quantidadetropas);

      await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeno atraso para evitar travamento do navegador

    }
  }

  async function Remanejar(partidaDados, lobbyId, Territorio1, Territorio2, quantidadetropas) {
    try {
      // Encontrar o território na lista de territórios da partida
      const territorio = partidaDados.territorios.find(territorio => territorio.id === Territorio1);
      const territorio2 = partidaDados.territorios.find(territorio2 => territorio2.id === Territorio2);

      if (territorio && territorio2) {
        // Atualizar as tropas do território encontrado
        territorio.tropas -= quantidadetropas;
        territorio2.tropas += quantidadetropas;

        // Montar a URL para a requisição PUT
        const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;

        // Fazer a requisição PUT para atualizar a partida
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados) // Enviar toda a partida com o território modificado
        });

        // Verificar se a requisição foi bem-sucedida
        if (response.ok) {
          console.log(`Remanejado ${quantidadetropas} do território ${territorio} para o  territorio ${territorio2}`);
        } else {
          console.error(`Erro ao atualizar tropas do território ${territorio}: ${response.status} - ${response.statusText}`);
          throw new Error(`Erro ao atualizar tropas do território ${territorio}`);
        }
      } else {
        console.error(`Território com ID ${territorio} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar tropas do território:', error.message);
      throw error;
    }
  }

  async function AtacarTerritorios(lobbyId, PartidaDados3, botaoId) // Função de ataque do jogador I.
  {

    while (!pararLoop) {

      esperarCliqueBotao('FimAtaqueBTN');

      console.log("i =" + i);

      let AlvosTerrtorios = [
        { id: 1, podeAtacar: [2, 3, 4, 32] },
        { id: 2, podeAtacar: [1, 4] },
        { id: 3, podeAtacar: [1, 4, 5] },
        { id: 4, podeAtacar: [3, 1, 2] },
        { id: 5, podeAtacar: [3, 6, 28] },
        { id: 6, podeAtacar: [5, 28, 27, 7] },
        { id: 7, podeAtacar: [6, 27, 8, 9] },
        { id: 8, podeAtacar: [9, 7, 27, 29] },
        { id: 9, podeAtacar: [8, 7, 14] },
        { id: 10, podeAtacar: [29, 27, 28] },
        { id: 11, podeAtacar: [14, 13, 15] },
        { id: 12, podeAtacar: [30, 19, 42, 17] },
        { id: 13, podeAtacar: [14, 11, 15, 18] },
        { id: 14, podeAtacar: [38, 18, 13, 11] },
        { id: 15, podeAtacar: [11, 13, 18, 23, 16] },
        { id: 16, podeAtacar: [15, 23, 20, 19] },
        { id: 17, podeAtacar: [12, 19, 21, 22, 42] },
        { id: 18, podeAtacar: [14, 13, 15, 23] },
        { id: 19, podeAtacar: [16, 20, 25, 21, 17, 12] },
        { id: 20, podeAtacar: [16, 23, 26, 25, 19] },
        { id: 21, podeAtacar: [22, 17, 19, 25, 31, 32] },
        { id: 22, podeAtacar: [42, 17, 21, 32] },
        { id: 23, podeAtacar: [24, 26, 20, 16, 15, 18] },
        { id: 24, podeAtacar: [26, 23, 40, 39] },
        { id: 25, podeAtacar: [31, 34, 26, 20, 19] },
        { id: 26, podeAtacar: [24, 23, 20, 25] },
        { id: 27, podeAtacar: [10, 28, 6, 7, 8] },
        { id: 28, podeAtacar: [10, 27, 6, 5] },
        { id: 29, podeAtacar: [10, 27, 8, 30] },
        { id: 30, podeAtacar: [29, 42, 12] },
        { id: 31, podeAtacar: [21, 25, 32, 34] },
        { id: 32, podeAtacar: [1, 22, 21, 31, 34, 33] },
        { id: 33, podeAtacar: [35, 34, 32] },
        { id: 34, podeAtacar: [31, 25, 32, 33, 35] },
        { id: 35, podeAtacar: [41, 34, 33] },
        { id: 36, podeAtacar: [39, 40, 37] },
        { id: 37, podeAtacar: [40, 36] },
        { id: 38, podeAtacar: [14, 18] },
        { id: 39, podeAtacar: [40, 36] },
        { id: 40, podeAtacar: [24, 39, 37, 36] },
        { id: 41, podeAtacar: [35, 34] },
        { id: 42, podeAtacar: [22, 30, 12, 17] }
      ];

      const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
      const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

      const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
        }
      }

      var PartidaDados = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

      for (j = 0; j < 42; j++) {
        if (PartidaDados.territorios[j].dono != i) { // Somente tira a opacidade dos que não são donos

          if (!svgDoc) {
            console.error('Erro ao acessar o conteúdo do documento SVG.');
            return;
          }

          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '0.5';
            paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
          }

        }

      }
      let Territorio1 = await EsperaClick('FimAtaqueBTN');
      if (pararLoop) {
        console.log("O loop foi interrompido pelo clique no botão.");

        for (j = 0; j < 42; j++) {
          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
            paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
          }
        }
        pararLoop = false;
        break;
      }
      Territorio1 = parseInt(Territorio1.getAttribute('inkscape:label').slice(4).match(/\d+/)[0]) - 1;

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '0.5'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
        }
      }

      for (j = 0; j < AlvosTerrtorios[Territorio1].podeAtacar.length // Lopping para mostrar os territorios atacaveis
        ; j++) {
        if (PartidaDados.territorios[AlvosTerrtorios[Territorio1].podeAtacar[j] - 1].dono != i) {
          //console.log("Territorio" + Territorio1 + " Alvo..." + AlvosTerrtorios[Territorio1].podeAtacar[j]);
          paths[AlvosTerrtorios[Territorio1].podeAtacar[j] - 1].style.opacity = '1.0'; //Deixar objeto em destaque
          paths[AlvosTerrtorios[Territorio1].podeAtacar[j] - 1].style.pointerEvents = "auto"; // Não ignorar objeto
          //console.log("Dono"+ PartidaDados.territorios[AlvosTerrtorios[Territorio1].podeAtacar[j] - 1].dono+" Turno"+PartidaDados.turno); // Ideal seria saber quem esta jogando e não ir pelo turno, corrigir futuralmente.
          //console.log('Territorio:' + AlvosTerrtorios[Territorio1].podeAtacar[j]);
        }
      }
      let Territorio2 = await EsperaClick('FimAtaqueBTN');
      if (pararLoop) {
        console.log("O loop foi interrompido pelo clique no botão.");

        for (j = 0; j < 42; j++) {
          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
            paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
          }
        }
        pararLoop = false;
        break;
      }
      Territorio2 = parseInt(Territorio2.getAttribute('inkscape:label').slice(4).match(/\d+/)[0]) - 1;

      for (j = 0; j < 42; j++) {
        for (let path of paths) {
          PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

          paths[PathA - 1].style.opacity = '1.0'; // Deixa o mapa apagado
          paths[PathA - 1].style.pointerEvents = "auto"; // Ignora o objeto
        }
      }

      if (pararLoop) {
        console.log("O loop foi interrompido pelo clique no botão.");
        break;
      }

      var PartidaDados5 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

      Tropa1 = PartidaDados5.territorios[Territorio1].tropas;
      Tropa2 = PartidaDados5.territorios[Territorio2].tropas;

      let resultado = simularAtaque(Tropa1, Tropa2);

      Tropa1 -= resultado.perdasAtacante;
      Tropa2 -= resultado.perdasDefensor;

      await atualizarTropasTerritorio(PartidaDados5, lobbyId, Territorio1, Tropa1);
      await atualizarTropasTerritorio(PartidaDados5, lobbyId, Territorio2, Tropa2);

      if (Tropa2 == 0 && Tropa1 >= 1) {
        await DominaTerritorio(PartidaDados5, lobbyId, Territorio2, i);
        // let quantidadetropas = 1; // Quantidade de tropas para remanejar, 1 para teste

        mostrarInput(); // Mostra o input para o jogador

        const quantidadetropas = await esperarInputremanejamento(Territorio1, Territorio2); // Espera o jogador inserir um número

        esconderInput()

        await Remanejar(PartidaDados5, lobbyId, Territorio1, Territorio2, quantidadetropas);


      }
      const preloader = document.getElementById('preloader');

      await ExibirTropas(lobbyId);//aplicação tropas
      await aplicarCores(lobbyId);


      await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeno atraso para evitar travamento do navegador

    }
  }

  function mostrarInput() {
    // Mostra o container de input
    document.getElementById('inputContainer').classList.remove('hidden');
  }

  function esconderInput() {
    // Esconde o container de input e limpa o valor do input
    document.getElementById('inputContainer').classList.add('hidden');
    document.getElementById('numeroInput').value = ''; // Limpa o input
  }

  async function esperarInputremanejamento(Territorio1, Territorio2) {
    return new Promise((resolve) => {
      // Cria uma nova promessa que será resolvida quando o input for processado

      const submitBtn = document.getElementById('submitBtn'); // Botão de submissão
      const numeroInput = document.getElementById('numeroInput'); // Campo de input

      async function processarInput() {
        // Processa o input do usuário
        const numero = parseInt(numeroInput.value, 10); // Converte o valor do input para um número inteiro

        if (isNaN(numero)) {
          // Se o valor não for um número válido, exibe um alerta
          console.log("Por favor, insira um número válido.");
          return;
        }

        if (numero <= 0) {
          // Se o valor não for um número válido, exibe um alerta
          console.log("Por favor, insira um número válido.");
          resolve(numero); // Resolve a promessa com o número inserido
        }

        const PartidaDados3 = await dadospartida(lobbyId); // Assume que a função dadospartida retorna um objeto com os dados da partida

        if (numero > PartidaDados3.territorios[Territorio1].tropas - 1) {
          // Se o valor for maior que as tropas disponiveis, exibe um alerta
          TropasR = PartidaDados3.territorios[Territorio1].tropas;
          TropasR -= 1;
          console.log("Tropas para remanejar:" + TropasR);
          return;
        }

        resolve(numero); // Resolve a promessa com o número inserido
        esconderInput(); // Esconde o input
        ExibirTropas(lobbyId); // Lentrete( Criar função para atualizar tropas no mapa essa cria mais elementos de texto sobrepostos)

        // Remove o event listener após a resolução da promessa
        submitBtn.removeEventListener('click', processarInput);
      }

      // Adiciona um event listener para o botão de submissão
      submitBtn.addEventListener('click', processarInput);
    });
  }

  function esperarInput() {
    return new Promise((resolve) => {
      // Cria uma nova promessa que será resolvida quando o input for processado
      const submitBtn = document.getElementById('submitBtn'); // Botão de submissão
      const numeroInput = document.getElementById('numeroInput'); // Campo de input

      async function processarInput() {
        // Processa o input do usuário
        const numero = parseInt(numeroInput.value, 10); // Converte o valor do input para um número inteiro

        if (isNaN(numero)) {
          // Se o valor não for um número válido, exibe um alerta
          alert("Por favor, insira um número válido.");
          return;
        }

        if (numero <= 0) {
          // Se o valor não for um número válido, exibe um alerta
          alert("Por favor, insira um número válido.");
          return;
        }

        const PartidaDados3 = await dadospartida(lobbyId); // Assume que a função dadospartida retorna um objeto com os dados da partida

        if (numero > PartidaDados3.playerSlots[PartidaDados3.turno].tropas) {
          // Se o valor for maior que as tropas disponiveis, exibe um alerta
          alert("Tropas restantes:" + PartidaDados3.playerSlots[PartidaDados3.turno].tropas);
          return;
        }

        resolve(numero); // Resolve a promessa com o número inserido
        esconderInput(); // Esconde o input
        ExibirTropas(lobbyId); // Lentrete( Criar função para atualizar tropas no mapa essa cria mais elementos de texto sobrepostos)

        // Remove o event listener após a resolução da promessa
        submitBtn.removeEventListener('click', processarInput);
      }

      // Adiciona um event listener para o botão de submissão
      submitBtn.addEventListener('click', processarInput);
    });
  }


  async function atualizarTropasJogador(partidaDados, idJogador, novasTropas) {
    const jogador = partidaDados.playerSlots.find(jogador => jogador.id === idJogador);
    if (jogador) {
      jogador.tropas = novasTropas;

      const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados)
        });
        if (response.ok) {
          console.log(`Tropas do jogador ${idJogador} atualizadas para ${novasTropas}`);
        } else {
          console.error(`Erro ao atualizar a partida: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    } else {
      console.error(`Jogador com ID ${idJogador} não encontrado.`);
    }
  }

  async function DominaTerritorio(partidaDados, idPartida, territorioId, turno) {
    try {
      // Encontrar o território na lista de territórios da partida
      const territorio = partidaDados.territorios.find(territorio => territorio.id === territorioId);

      if (territorio) {
        // Atualizar as tropas do território encontrado
        territorio.dono = turno;
        console.log("" + turno + " " + territorio.dono);
        // Montar a URL para a requisição PUT
        const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;

        // Fazer a requisição PUT para atualizar a partida
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados) // Enviar toda a partida com o território modificado
        });

        // Verificar se a requisição foi bem-sucedida
        if (response.ok) {
          console.log(` Território ${territorioId} dominado por ${turno}`);
        } else {
          console.error(`Erro ao atualizar tropas do território ${territorioId}: ${response.status} - ${response.statusText}`);
          throw new Error(`Erro ao atualizar tropas do território ${territorioId}`);
        }
      } else {
        console.error(`Território com ID ${territorioId} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar tropas do território:', error.message);
      throw error;
    }
  }
  // Função para atualizar as tropas de um território por ID
  async function atualizarTropasTerritorio(partidaDados, idPartida, territorioId, novoNumeroTropas) {
    try {
      // Encontrar o território na lista de territórios da partida
      const territorio = partidaDados.territorios.find(territorio => territorio.id === territorioId);

      if (territorio) {
        // Atualizar as tropas do território encontrado
        territorio.tropas = novoNumeroTropas;

        // Montar a URL para a requisição PUT
        const url = `https://45.140.193.150:8443/partida/${partidaDados.id}`;

        // Fazer a requisição PUT para atualizar a partida
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(partidaDados) // Enviar toda a partida com o território modificado
        });

        // Verificar se a requisição foi bem-sucedida
        if (response.ok) {
          console.log(`Tropas do território ${territorioId} atualizadas para ${novoNumeroTropas}`);
        } else {
          console.error(`Erro ao atualizar tropas do território ${territorioId}: ${response.status} - ${response.statusText}`);
          throw new Error(`Erro ao atualizar tropas do território ${territorioId}`);
        }
      } else {
        console.error(`Território com ID ${territorioId} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar tropas do território:', error.message);
      throw error;
    }
  }

  function esperarCliqueBotao2(botaoId) {
    return new Promise((resolve) => {
      const botao = document.getElementById(botaoId);

      function handleClick() {
        pararLoop2 = true; // Atualiza a variável de controle para interromper o loop
        resolve(); // Resolve a promessa para sinalizar que o botão foi clicado
        botao.removeEventListener('click', handleClick); // Remove o event listener após o clique
        console.log("Finalizado...");
      }
      // Adiciona o event listener para o clique no botão
      botao.addEventListener('click', handleClick);
    });
  }

  function esperarCliqueBotao(botaoId) {
    return new Promise((resolve) => {
      const botao = document.getElementById(botaoId);

      function handleClick() {
        pararLoop = true; // Atualiza a variável de controle para interromper o loop
        resolve(); // Resolve a promessa para sinalizar que o botão foi clicado
        botao.removeEventListener('click', handleClick); // Remove o event listener após o clique
      }
      // Adiciona o event listener para o clique no botão
      botao.addEventListener('click', handleClick);
    });
  }

  let pararLoop = false; // Variável de controle para interromper o loop
  let pararLoop2 = false; // Variável de controle para interromper o loop

  async function loopInterrompivel(botaoId) {
    while (!pararLoop) {
      console.log("Executando o loop...");
      // Aqui você pode colocar a lógica do loop
      await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeno atraso para evitar travamento do navegador
    }

    console.log("O loop foi interrompido porque o botão foi clicado!");
  }

  async function rodadaDeJogadores(lobbyId, PartidaDados2) {
    // Função assíncrona que gerencia a rodada de jogadores
    //    console.log("Vez do Jogador: " + PartidaDados.playerSlots[i].id); // Exibe o ID do jogador atual no console

    const svgObject = document.getElementById('svgObject'); // Obtém o objeto SVG pelo ID
    const svgDoc = svgObject.contentDocument; // Obtém o documento interno do objeto SVG

    const paths = svgDoc.querySelectorAll('path'); // Seleciona todos os elementos 'path' no documento SVG

    while (PartidaDados2.playerSlots[i].tropas > 0) { // Distribuir ate zerar as tropas
      PartidaDados2 = await dadospartida(lobbyId);
      for (j = 0; j < 42; j++) {
        if (PartidaDados.territorios[j].dono != i) {

          if (!svgDoc) {
            console.error('Erro ao acessar o conteúdo do documento SVG.');
            return;
          }

          for (let path of paths) {
            PathA = paths[j].getAttribute('inkscape:label').slice(4).match(/\d+/)[0];

            paths[PathA - 1].style.opacity = '0.5';
            paths[PathA - 1].style.pointerEvents = "none"; // Ignora o objeto
          }

        }

      }

      let Territorio1 = await EsperaClick();

      await removerEventListeners();

      Territorio1 = parseInt(Territorio1.getAttribute('inkscape:label').slice(4).match(/\d+/)[0])

      mostrarInput(); // Mostra o input para o jogador
      const numero = await esperarInput(); // Espera o jogador inserir um número

      for (j = 0; j < 42; j++) {

        paths[j].style.opacity = '1.0';
        paths[j].style.pointerEvents = "auto"; // Ignora o objeto

      }

      TropasJogador = PartidaDados2.playerSlots[i].tropas - numero;
      NovaTropasTerritorio = PartidaDados2.territorios[Territorio1 - 1].tropas + numero;

      await atualizarTropasJogador(PartidaDados2, i, TropasJogador); // Atualiza as tropas do jogador com ID 0 para 5
      await atualizarTropasTerritorio(PartidaDados2, lobbyId, Territorio1 - 1, NovaTropasTerritorio); // Atualiza as tropas do território com ID 2 para 10    
      await ExibirTropas(lobbyId);//aplicação tropas

    }

    var PartidaDados3 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
    await AtacarTerritorios(lobbyId, PartidaDados3, "FimAtaqueBTN");
    var PartidaDados4 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby
    await RemajenarTerritorio(lobbyId, PartidaDados4, "FinalizarBTN") // Função para remanejar depois de atacar
    
    await AtualizaTurno(PartidaDados2.id, PartidaDados2.turno + 1);

  }


  for (i = PartidaDados.turno; i < 8; i++) { // Looping da Vez do Jogador

    console.log("Vez do Jogador:" + PartidaDados.playerSlots[i].id); // Exibe o ID do jogador atual no console

    var PartidaDados2 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

    // Inicia a sequência chamando rodadaDeJogadores()
    await rodadaDeJogadores(lobbyId, PartidaDados2); // Espera a função assíncrona finalizar antes de continuar o loop


    if (PartidaDados2.turno >= 8) {
      await AtualizaTurno(PartidaDados2.id, 0);
      await Atualizafase(lobbyId, 2);
      return;
    }
  }
  console.log("Todos os jogadores inseriram seus números."); // Exibe no console que todos os jogadores inseriram seus números

  var PartidaDados4 = await dadospartida(lobbyId); // Aguarda a resolução da Promise e obtém os dados do lobby

  if (PartidaDados4.turno >= 8) {
    await AtualizaTurno(PartidaDados4.id, -1);
    await Atualizafase(lobbyId, PartidaDados4.fase + 1);
    return;
  }

  console.log("...Final do turno teste"); // Exibe uma mensagem indicando o final do turno

  // Finalizar turno, proximo jogador.

}


const dice = document.getElementById('dice');
const rollBtn = document.getElementById('rollBtn');

rollBtn.addEventListener('click', rollDice);

function rollDice() {
  dice.classList.add('rolling');

  // Remove the 'rolling' class after the animation is done
  setTimeout(() => {
    dice.classList.remove('rolling');

    const randNumber = Math.floor(Math.random() * 6) + 1;
    let xRotation = 0;
    let yRotation = 0;

    switch (randNumber) {
      case 1:
        xRotation = 0;
        yRotation = 0;
        break;
      case 2:
        xRotation = 0;
        yRotation = 180;
        break;
      case 3:
        xRotation = 0;
        yRotation = -90;
        break;
      case 4:
        xRotation = 0;
        yRotation = 90;
        break;
      case 5:
        xRotation = -90;
        yRotation = 0;
        break;
      case 6:
        xRotation = 90;
        yRotation = 0;
        break;
    }

    dice.style.transform = `rotateX(${xRotation + 1800}deg) rotateY(${yRotation + 1800}deg)`;

    console.log(`Número rolado: ${randNumber}`);
  }, 2000); // The duration of the roll animation
}

dice.style.transform = 'rotateX(15deg) rotateY(15deg)';
