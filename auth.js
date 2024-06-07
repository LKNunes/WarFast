async function login() {
    const usuario = document.getElementById('usuarioLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {
        const response = await fetch('https://api-render-pet.onrender.com/usuarios', {
            method: 'GET',
        });

        if (!response.ok) throw new Error('Erro ao buscar usuários');

        const usuarios = await response.json();
        const usuarioExistente = usuarios.find(u => u.usuario === usuario);

        if (usuarioExistente && usuarioExistente.senha === senha) {
            localStorage.setItem('loggedIn', 'true');  // Salva o estado de login
            window.location.href = '../../index.html'; // Redireciona para a página inicial
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao autenticar usuário.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logarLink = document.getElementById('logarLink');
    const inscreverLink = document.getElementById('inscreverLink');
    const contaIcon = document.getElementById('contaIcon');
    
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (isLoggedIn) {
        logarLink.style.display = 'none';
        inscreverLink.style.display = 'none';
        contaIcon.style.display = 'inline-block';
    } else {
        logarLink.style.display = 'inline-block';
        inscreverLink.style.display = 'inline-block';
        contaIcon.style.display = 'none';
    }
});

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = '../../index.html'; // Redireciona para a página inicial após logout
}

async function cadastrarUsuario() {
    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const senhaUsuario = document.getElementById('senhaUsuario').value;

    try {
        const response = await fetch('https://api-render-pet.onrender.com/usuarios', {
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

