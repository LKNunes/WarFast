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

  document.getElementById('Perfil').addEventListener('click', function() {
    document.getElementById('criarLobbyForm').style.display = 'none';
    document.getElementById('entrarLobbyForm').style.display = 'none';
    document.getElementById('Perfil2').style.display = 'block';
  });

 // const fs = require('fs');

function getUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        return usuarioLogado;
    } else {
        return 'Usuário não logado';
    }
}

async function criarlobby() {
  const nomeUsuario = localStorage.getItem('usuarioLogado');
  
  try {
      const response = await fetch('https://dbwar.onrender.com/lobbies', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: Date.now().toString(),
              leaderId: nomeUsuario,
              lobbyName: `Lobby de ${nomeUsuario}`,
              playerSlots: ['', '', '', '', '', '', '', '']
          })
      });

      if (!response.ok) {
          throw new Error('Erro ao criar lobby');
      }

      const data = await response.json();
      const lobbyId = data.id; // Pegando o ID do lobby criado

      alert('Lobby criado com sucesso! ID: ' + lobbyId);
      // $('#cadastroModal').modal('hide');

      // Redirecionar para a página do lobby com o ID na URL
      window.location.href = `/lobby/lobby.html?id=${lobbyId}`;

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

async function adicionarUsuarioAoLobby() {
  try {
      // Primeiro, busque o lobby existente pelo ID
      const params = new URLSearchParams(window.location.search);
      
      const lobbyNumber = params.get('id'); 

      console.log(lobbyNumber);
      
      const usuarioLogado = localStorage.getItem('usuarioLogado'); // Obter ID do usuário logado do localStorage
      
      const response = await fetch(`https://dbwar.onrender.com/lobbies/${lobbyNumber}`);
      if (!response.ok) {
          throw new Error('Erro ao buscar lobby');
      }

      const lobby = await response.json();
      
      const jaexiste = lobby.playerSlots.findIndex(slot => slot === usuarioLogado);
      if (jaexiste !== -1) {
          alert('Já está no lobby! ANIMAL');
          return;
      }      // Encontre o primeiro slot vazio
      const slotIndex = lobby.playerSlots.findIndex(slot => slot === '');
      if (slotIndex === -1) {
          alert('Não há slots vazios disponíveis no lobby');
          return;
      }

      // Adicione o usuário ao primeiro slot vazio
      lobby.playerSlots[slotIndex] = usuarioLogado;

      // Envie a atualização de volta ao servidor
      const updateResponse = await fetch(`https://dbwar.onrender.com/lobbies/${lobbyNumber}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(lobby)
      });

      if (!updateResponse.ok) {
          throw new Error('Erro ao atualizar lobby');
      }

      alert('Usuário adicionado com sucesso ao lobby!');
      redirect(`/lobby/lobby.html?id=${lobbyNumber}`); // Redirecionar para a página do lobby

  } catch (error) {
      console.error('Erro ao adicionar usuário ao lobby:', error);
  }
}

function lobbyhtml()
{
const lobbyNumber = document.getElementById('lobbyNumber').value; // Obter valor do campo de entrada
redirect(`/lobby/lobby.html?id=${lobbyNumber}`); // Redirecionar para a página do lobby
}

async function removerUsuarioDoLobby() {
  const lobbyNumber = getLobbyIdFromURL(); // Obter ID do lobby da URL
  const usuarioLogado = localStorage.getItem('usuarioLogado'); // Obter ID do usuário logado do localStorage

  if (!lobbyNumber) {
      alert('Por favor, insira um número de lobby.');
      return;
  }

  if (!usuarioLogado) {
      alert('Usuário não está logado.');
      return;
  }

  try {
      // Buscar o lobby existente pelo ID
      const response = await fetch(`https://dbwar.onrender.com/lobbies/${lobbyNumber}`);
      if (!response.ok) {
          throw new Error('Erro ao buscar lobby');
      }

      const lobby = await response.json();

      // Encontrar o índice do usuário no array de playerSlots
      const slotIndex = lobby.playerSlots.findIndex(slot => slot === usuarioLogado);
      if (slotIndex === -1) {
          alert('Usuário não encontrado no lobby');
          return;
      }

      // Remover o usuário do slot
      lobby.playerSlots[slotIndex] = '';

      // Enviar a atualização de volta ao servidor
      const updateResponse = await fetch(`https://dbwar.onrender.com/lobbies/${lobbyNumber}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(lobby)
      });

      if (!updateResponse.ok) {
          throw new Error('Erro ao atualizar lobby');
      }

      alert('Usuário removido com sucesso do lobby!');
      redirect(`/lobby/lobby.html?id=${lobbyNumber}`); // Redirecionar para a página do lobby
  } catch (error) {
      console.error('Erro ao remover usuário do lobby:', error);
  }
}

function redirect(html){
  window.location.href = html;
}  

function getLobbyIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}