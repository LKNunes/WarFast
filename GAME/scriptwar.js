// Associação de imagens aos territórios
        const territoriosImagens = {
            "brasil": ["Paises/brasil1.png", "Paises/brasil2.png", "Paises/brasil3.png", "Paises/Brasil4.pngar", "Paises/brasil5.png", "Paises/brasil6.png"],
            "Argentina": ["Paises/Argentina1.png", "Paises/Argentina2.png", "Paises/Argentina3.png", "Paises/Argentina4.png", "Paises/Argentina5.png", "Paises/Argentina6.png"]
        };

        const jogadores = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4", "Jogador 5", "Jogador 6"];
        const territorioBrasilSelecionado = document.getElementById("territorioBrasil").querySelector(".territorioImagem");
        const territorioArgentinaSelecionado = document.getElementById("territorioArgentina").querySelector(".territorioImagem");

        // Verificar se o dono do território já foi escolhido
        function obterProprietarioTerritorio(territorio) {
            const proprietario = jogadores[Math.floor(Math.random() * jogadores.length)];
            return proprietario;
        }

        // Escolher o dono inicial para os territórios
        const proprietarioBrasil = obterProprietarioTerritorio("Brasil");
        const proprietarioArgentina = obterProprietarioTerritorio("Argentina");

        // Função para atualizar a imagem do território
        function atualizarImagemTerritorio() {
            const donoBrasil = proprietarioBrasil;
            const donoArgentina = proprietarioArgentina;

            // Use o índice do jogador como parte do nome da imagem
            const imagemBrasil = `Paises/Brasil${jogadores.indexOf(donoBrasil) + 1}.png`;
            const imagemArgentina = `Paises/Argentina${jogadores.indexOf(donoArgentina) + 1}.png`;

            territorioBrasilSelecionado.src = imagemBrasil;
            territorioArgentinaSelecionado.src = imagemArgentina;

            // Imprima o dono e o nome do território no console
            console.log(`Dono do território "Brasil": ${donoBrasil}`);
            console.log(`Dono do território "Argentina": ${donoArgentina}`);
        }

        // Exibir a imagem inicial dos territórios
        atualizarImagemTerritorio();