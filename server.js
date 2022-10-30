const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

app.get('/mais-jogados', async (req, res) => {
    let listaJogos = [];
    var objetoJogos = {};

    const request = {
        method: 'get',
        url: 'https://steamspy.com/api.php?request=top100forever'
    }

    await axios(request)
    .then(async (result) => {
        console.log(result)

        if (result.data !== '') {
            let jogos = result.data;
    
            let contador = 0;
    
            for (var jogo in jogos) {
                var id = jogos[jogo].appid;
                var nome = jogos[jogo].name;
                var desenvolvedor = jogos[jogo].developer;
                var publicador = jogos[jogo].developer;
                var quantidadeRevisoes = jogos[jogo].score_rank;
                var quantidadeDonos = jogos[jogo].owners;
                var quantidadeJogadores = jogos[jogo].ccu;
                var capsule = jogos[jogo].capsule = `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo}/capsule_231x87.jpg`;
    
                listaJogos[contador] = {
                    id: id,
                    nome: nome,
                    desenvolvedor: desenvolvedor,
                    publicador: publicador,
                    quantidade_revisoes: quantidadeRevisoes,
                    quantidade_donos: quantidadeDonos,
                    quantidade_jogadores: quantidadeJogadores,
                    capsule: capsule
                }
    
                contador++;
            }
    
            listaJogos.sort((a, b) => b.quantidade_jogadores - a.quantidade_jogadores);
    
            objetoJogos = Object.assign({}, listaJogos);
    
            res.send(objetoJogos);
        } else {
            res.status(404).send('Não foi possível encontrar a lista de jogos!');
        }
    })
    .catch((err) => {
        console.log(err)

        res.status(500).send('Ocorreu um erro ao realizar a busca dos jogos. Por favor, tente novamente mais tarde!');
    });
});

const protocol = 'http';
const hostname = 'localhost';
const port = 8000;

app.listen(port, () => {
    console.log(`O app está sendo executado no endereço: ${protocol}://${hostname}:${port}`)
});