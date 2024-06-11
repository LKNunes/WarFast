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

async function signup() {
    const usuario = document.getElementById('usuarioLogin').value;
    const senha = document.getElementById('senhaLogin').value;
    
    // Validação básica dos campos de entrada
    if (!usuario || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('https://raw.githubusercontent.com/LKNunes/WarFast/main/DB/db.json', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        const jsonResponse = await response.json();
        const usuarios = jsonResponse.usuarios;

        if (!Array.isArray(usuarios)) {
            throw new Error('O formato do JSON não é válido. Esperado um array de usuários.');
        }

        const usuarioExistente = usuarios.find(u => u.usuario === usuario);

        if (usuarioExistente) {
            alert('Usuário já existe. Por favor, escolha outro nome de usuário.');
            return;
        }

        // Adiciona o novo usuário à lista
        usuarios.push({ usuario, senha });

        // Atualiza o arquivo no GitHub
        const updateResponse = await fetch('https://api.github.com/repos/LKNunes/WarFast/contents/DB/db.json', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer CHAVEDBWAR',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Adiciona novo usuário',
                content: btoa(JSON.stringify({ usuarios }, null, 2)),
                sha: jsonResponse.sha // Corrigido para obter o SHA do arquivo atualizado
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar o arquivo no GitHub');
        }

        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';  // Redireciona para a página de login
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao cadastrar usuário: ${error.message}`);
    }
}



function redirectCriarConta(){
        window.location.href = 'cadastrarUsuario.html';
}
