async function login() {
    const usuario = document.getElementById('usuarioLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {
        const response = await fetch('https://raw.githubusercontent.com/LKNunes/WarFast/main/DB/db.json', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
            
        }

        const jsonResponse = await response.json();
        const usuarios = jsonResponse.usuarios; // Acessa a lista de usuários dentro do JSON

        // Verifique se `usuarios` é um array
        if (!Array.isArray(usuarios)) {
            throw new Error('O formato do JSON não é válido. Esperado um array de usuários.');
        }

        // Verifique se o array não está vazio e tem o formato esperado
        if (usuarios.length === 0 || !usuarios[0].hasOwnProperty('usuario') || !usuarios[0].hasOwnProperty('senha')) {
            throw new Error('O formato do JSON não é válido ou está vazio.');
        }

        const usuarioExistente = usuarios.find(u => u.usuario === usuario);

        if (usuarioExistente && usuarioExistente.senha === senha) {
            localStorage.setItem('loggedIn', 'true');  // Salva o estado de login
            window.location.href = 'inicio.html';  // Redireciona para a página inicial
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao autenticar usuário.');
    }
}

// Adiciona um Event Listener ao botão de login para chamar a função login
document.getElementById('loginButton').addEventListener('click', login);


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


function redirectCriarConta(){
        window.location.href = 'cadastrarUsuario.html';
}

function signin(){
// URL do servidor onde o JSON está hospedado
const url = 'https://raw.githubusercontent.com/LKNunes/WarFast/main/DB/db.json';

// Dados do novo usuário
const novoUsuario = {
    "id": 1716161234277,
    "usuario": "novo_usuario",
    "senha": "nova_senha"
};
// Realizar uma requisição para obter o JSON atual
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Adicionar o novo usuário ao array de usuários
            data.usuarios.push(novoUsuario);
    
            // Enviar uma requisição PUT para atualizar o JSON no servidor
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log('Usuário cadastrado com sucesso!'))
            .catch(error => console.error('Erro ao cadastrar usuário:', error));
        })
        .catch(error => console.error('Erro ao obter o JSON do servidor:', error));
}
