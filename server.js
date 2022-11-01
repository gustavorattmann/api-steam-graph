const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

const url = 'https://store.steampowered.com/charts/mostplayed/';

app.get('/mais-jogados/:pagina?', async (req, res, next) => {
    const pagina = req.params.pagina;

    if (pagina === undefined || (pagina > 0 && pagina < 11)) {
        let listaJogos = [];

        (async function obterJogos() {
            const {Builder, By, Key, until} = require('selenium-webdriver');
            require('chromedriver');
            const chrome = require('selenium-webdriver/chrome');

            const options = new chrome.Options();
            options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
            let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

            options.addArguments('--headless');
            options.addArguments('--disable-dev-shm-usage');
            options.addArguments('--disable-gpu');
            options.addArguments('--no-sandbox');
            options.addArguments('--window-size=1920,1080');

            try {
                const driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .setChromeService(serviceBuilder)
                    .build();
                
                await driver.get(url);

                const data = await driver.wait(until.elementLocated(By.xpath('//*[@id="application_root"]/div/div/div/div/div[3]/table'), 2000)).getAttribute('outerHTML');

                await driver.quit();

                const $ = cheerio.load(data);
                
                $('.weeklytopsellers_TableRow_2-RN6').each((i, elem) => {
                    var id = $(elem).find('.weeklytopsellers_RankCell_34h48').text();
                    var nome = $(elem).find('.weeklytopsellers_GameName_1n_4-').text();
                    var imagem = $(elem).find('.weeklytopsellers_CapsuleArt_2dODJ').attr('src');
                    var link = $(elem).find('.weeklytopsellers_TopChartItem_2C5PJ').attr('href');
                    var precoOriginal = $(elem).find('.salepreviewwidgets_StoreOriginalPrice_1EKGZ').text();
                    var precoDesconto = $(elem).find('.salepreviewwidgets_StoreSalePriceBox_Wh0L8').text();
                    var porcentagem = $(elem).find('.salepreviewwidgets_StoreSaleDiscountBox_2fpFv').text();
                    var jogando = $(elem).find('.weeklytopsellers_ConcurrentCell_3L0CD').text();
                    var pico = $(elem).find('.weeklytopsellers_PeakInGameCell_yJB7D').text();

                    if (precoDesconto === 'Free To Play') {
                        precoOriginal = 'Gratuito para jogar';
                        precoDesconto = '';
                    }

                    listaJogos.push({
                        id: id,
                        nome: nome,
                        imagem: imagem,
                        link: link,
                        preco_original: precoOriginal,
                        preco_desconto: precoDesconto,
                        porcentagem: porcentagem,
                        jogando: jogando,
                        pico: pico
                    });
                });

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
            } catch (err) {
                console.error(err);
            }
        })();
    } else {
        return next();
    }
});

app.all('*', function (req, res) {
    res.status(404).send('Rota não encontrada!');
});

const protocol = 'https';
const hostname = 'api-steam-graph.herokuapp.com';
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`O app está sendo executado no endereço: ${protocol}://${hostname}:${port}`)
});