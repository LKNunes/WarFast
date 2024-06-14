async function começarPartida() {
    const nomeUsuario = localStorage.getItem('usuarioLogado');
    
    try {
        const response = await fetch('https://dbwar.onrender.com/PARTIDAS', {
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
  