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
    document.getElementById('entrarLobbyForm').style.display = 'none';
    document.getElementById('Perfil2').style.display = 'block';
  });

  const fs = require('fs');

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
        alert('Lobby criado com sucesso!');
        $('#cadastroModal').modal('hide');
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
