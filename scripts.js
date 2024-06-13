// scripts.js
document.getElementById('entrarLobby').addEventListener('click', function() {
    document.getElementById('entrarLobbyForm').style.display = 'block';
    document.getElementById('criarLobbyForm').style.display = 'none';
  });
  
  document.getElementById('criarLobby').addEventListener('click', function() {
    document.getElementById('criarLobbyForm').style.display = 'block';
    document.getElementById('entrarLobbyForm').style.display = 'none';
  });
  
  document.getElementById('goToLobby').addEventListener('click', function() {
    const lobbyNumber = document.getElementById('lobbyNumber').value;
    if (lobbyNumber) {
      window.location.href = `/lobby/lobby.html?id=${lobbyNumber}`;
    } else {
      alert('Por favor, insira um número de lobby.');
    }
  });
  
  document.getElementById('criarNovoLobby').addEventListener('click', function() {
    const numeroJogadores = document.getElementById('numeroJogadores').value;
    // Aqui você pode realizar as ações necessárias com os dados do novo lobby
    if (numeroJogadores) {
      alert('Lobby criado com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  });
  

  async function criarlobby() {
    const nomeUsuario = document.getElementById('usuarioLogin').value;
    const senhaUsuario = document.getElementById('senhaLogin').value;

     console.log(nomeUsuario)
     console.log(senhaUsuario)
    try {
        const response = await fetch('https://dbwar.onrender.com/lobbies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Date.now(), // Adicionando um ID fictício
                usuario: nomeUsuario,
                senha: senhaUsuario
            })
        });

        if (!response.ok) throw new Error('Erro ao cadastrar usuário');

        alert('Usuário cadastrado com sucesso!');
        $('#cadastroModal').modal('hide'); // Fecha o modal de cadastro
    } catch (error) {
    }
}