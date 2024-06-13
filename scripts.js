// scripts.js
    document.getElementById('entrarLobby').addEventListener('click', function() {
    document.getElementById('entrarLobbyForm').style.display = 'block';
    document.getElementById('criarLobbyForm').style.display = 'none';
    document.getElementById('Perfil2').style.display = 'none';
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
  });
 
  document.getElementById('criarLobby').addEventListener('click', function() {
    document.getElementById('criarLobbyForm').style.display = 'block';
    document.getElementById('entrarLobbyForm').style.display = 'none';
    document.getElementById('Perfil2').style.display = 'none';
  });
  
  document.getElementById('goToLobby').addEventListener('click', function() {
    const lobbyNumber = document.getElementById('lobbyNumber').value;
    if (lobbyNumber) {
      window.location.href = `/lobby/lobby.html?id=${lobbyNumber}`;
    } else {
      alert('Por favor, insira um número de lobby.');
    }
  });

  document.getElementById('Perfil').addEventListener('click', function() {
    document.getElementById('criarLobbyForm').style.display = 'none';
    document.getElementById('entrarLobbyForm').style.display = 'block';
    document.getElementById('Perfil2').style.display = 'none';
  });

  const fs = require('fs');

  async function criarlobby() { // Não finalizada ainda em construção
      const nomeUsuario = document.getElementById('usuarioLogin').value;
      const senhaUsuario = document.getElementById('senhaLogin').value;
  
      try {
          const novoLobby = {
              lobbyId: Date.now().toString(), // Convertendo o ID para string
              leaderId: nomeUsuario,
              lobbyName: `Lobby de ${nomeUsuario}`,
              playerSlots: ['', '', '', '', '', '', '', ''] // Slots vazios
          };
  
          // Lendo o arquivo existente, se houver
          let lobbiesData;
          try {
              lobbiesData = JSON.parse(fs.readFileSync('lobbies.json', 'utf-8'));
          } catch (error) {
              // Se o arquivo não existir ou estiver vazio, inicialize como um objeto vazio
              lobbiesData = { lobbies: [] };
          }
  
          // Adicionando o novo lobby aos dados existentes
          lobbiesData.lobbies.push(novoLobby);
  
          // Escrevendo os dados atualizados de volta no arquivo
          fs.writeFileSync('lobbies.json', JSON.stringify(lobbiesData, null, 2));
  
          alert('Lobby criado com sucesso!');
          $('#cadastroModal').modal('hide'); // Fecha o modal de cadastro
      } catch (error) {
          console.error('Erro ao criar lobby:', error);
      }
  }
  

  function logoff() {
    localStorage.removeItem('loggedIn'); // Remover estado de login
    localStorage.removeItem('usuarioLogado'); // Remover nome de usuário logado
    window.location.href = '/index.html'; // Redirecionar para a página de login
  }

function verificarLogin() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn) {
    window.location.href = '/index.html'; // Redirecionar para a página de login
  }
}
