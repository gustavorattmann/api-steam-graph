const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

app.get('/mais-jogados/:pagina?', async (req, res, next) => {
    const pagina = req.params.pagina;

    if (pagina === undefined || (pagina > 0 && pagina < 11)) {
        let listaJogos = [];
        var objetoJogos = {};
    
        const request = {
            method: 'get',
            url: 'https://steamspy.com/api.php?request=top100forever'
        }
    
        await axios(request)
        .then(async (result) => {
            // console.log(result)
    
            if (result.data !== '') {
                let jogos = result.data;
        
                let contador = 0;
        
                for (var jogo in jogos) {
                    var precoCorrigido = parseInt(jogos[jogo].price) !== 0 ? (parseInt(jogos[jogo].price) / 100).toFixed(2) : 0;
    
                    var id = jogos[jogo].appid;
                    var nome = jogos[jogo].name;
                    var preco = precoCorrigido;
                    var avaliacoesPositivas = jogos[jogo].positive;
                    var avaliacoesNegativas = jogos[jogo].negative;
                    var desenvolvedor = jogos[jogo].developer;
                    var publicador = jogos[jogo].developer;
                    var quantidadeDonos = jogos[jogo].owners;
                    var quantidadeJogadores = jogos[jogo].ccu;
                    var capsule = jogos[jogo].capsule = `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo}/capsule_231x87.jpg`;
        
                    listaJogos[contador] = {
                        id: id,
                        nome: nome,
                        preco: preco,
                        quantidade_revisoes_positivas: avaliacoesPositivas,
                        quantidade_revisoes_negativas: avaliacoesNegativas,
                        quantidade_donos: quantidadeDonos,
                        quantidade_jogadores: quantidadeJogadores,
                        desenvolvedor: desenvolvedor,
                        publicador: publicador,
                        capsule: capsule
                    }
        
                    contador++;
                }
        
                listaJogos.sort((a, b) => b.quantidade_jogadores - a.quantidade_jogadores);
    
                switch (pagina) {
                    case '1':
                        listaJogos = listaJogos.slice(0, 10).map((item) => {
                            return item;
                        });
                    break;
                    case '2':
                        listaJogos = listaJogos.slice(10, 20).map((item) => {
                            return item;
                        });
                    break;
                    case '3':
                        listaJogos = listaJogos.slice(20, 30).map((item) => {
                            return item;
                        });
                    break;
                    case '4':
                        listaJogos = listaJogos.slice(30, 40).map((item) => {
                            return item;
                        });
                    break;
                    case '5':
                        listaJogos = listaJogos.slice(40, 50).map((item) => {
                            return item;
                        });
                    break;
                    case '6':
                        listaJogos = listaJogos.slice(50, 60).map((item) => {
                            return item;
                        });
                    break;
                    case '7':
                        listaJogos = listaJogos.slice(60, 70).map((item) => {
                            return item;
                        });
                    break;
                    case '8':
                        listaJogos = listaJogos.slice(70, 80).map((item) => {
                            return item;
                        });
                    break;
                    case '9':
                        listaJogos = listaJogos.slice(80, 90).map((item) => {
                            return item;
                        });
                    break;
                    case '10':
                        listaJogos = listaJogos.slice(90, 100).map((item) => {
                            return item;
                        });
                    break;
                }
    
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
    } else {
        return next();
    }
});

app.all('*', function (req, res) {
    res.status(404).send('Rota não encontrada!');
});

const protocol = 'http';
const hostname = 'localhost';
const port = 8000;

app.listen(port, () => {
    console.log(`O app está sendo executado no endereço: ${protocol}://${hostname}:${port}`)
});