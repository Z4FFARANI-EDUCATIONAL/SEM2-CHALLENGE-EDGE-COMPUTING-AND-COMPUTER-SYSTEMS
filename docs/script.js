async function fetchData() {
    try {
        // Requisição para obter dados de temperatura (ºC)
        const temperaturaRes = await fetch("https://api.thingspeak.com/channels/2665201/fields/1.json?results=1");
        const temperaturaData = await temperaturaRes.json();
        const temperatura = temperaturaData.feeds.map(campo => campo.field1);

        // Requisição para obter dados de umidade (%)
        const umidadeRes = await fetch("https://api.thingspeak.com/channels/2665201/fields/2.json?results=1");
        const umidadeData = await umidadeRes.json();
        const umidade = umidadeData.feeds.map(campo => campo.field2);

        // Requisição para obter dados de distância (cm)
        const distanciaRes = await fetch("https://api.thingspeak.com/channels/2665201/fields/3.json?results=1");
        const distanciaData = await distanciaRes.json();
        const distancia = distanciaData.feeds.map(campo => campo.field3);

        // Requisição para obter dados de luminosidade (Lux)
        const luminosidadeRes = await fetch("https://api.thingspeak.com/channels/2665201/fields/4.json?results=1");
        const luminosidadeData = await luminosidadeRes.json();
        const luminosidade = luminosidadeData.feeds.map(campo => campo.field4);

        // Referência aos elementos HTML
        const boxTemperatura = document.getElementById('boxTemperatura');
        const boxUmidade = document.getElementById('boxUmidade');
        const boxDistancia = document.getElementById('boxDistancia');
        const boxLuminosidade = document.getElementById('boxLuminosidade');
        const boxAlgoritmo = document.getElementById('boxAlgoritmo');

        // Envio de variáveis requisitadas para arquivo HTML
        boxTemperatura.innerHTML = `<p>${temperatura}°C</p>`;
        boxUmidade.innerHTML = `<p>${umidade}%</p>`;
        boxDistancia.innerHTML = `<p>${distancia}cm</p>`;
        boxLuminosidade.innerHTML = `<p>${luminosidade}Lux</p>`;

        let estrategia = '';

        // Estratégia baseada nos dados recebidos graças às requisições
        if (temperatura > 30) {
            estrategia += " A temperatura elevada exige um gerenciamento eficaz da energia. Recomenda-se conservar energia nas primeiras voltas e fazer uso da potência total nas retas.";
        } else if (temperatura < 10) {
            estrategia += " Com temperaturas baixas, é crucial aquecer os pneus antes de acelerar ao máximo. A estratégia deve incluir um foco na tração nas curvas.";
        }

        if (umidade > 70) {
            estrategia += " A alta umidade pode tornar a pista escorregadia. Ajustes na pressão dos pneus podem ajudar a melhorar a aderência e a estabilidade.";
        } else if (umidade < 30) {
            estrategia += " Com umidade baixa, a pista tende a ser mais estável. Aumentar a pressão dos pneus pode oferecer uma vantagem em termos de velocidade.";
        }

        if (distancia > 300) {
            estrategia += " Com uma distância maior, é essencial monitorar o consumo de energia. Dividir a corrida em segmentos e ajustar a estratégia conforme o desgaste da bateria é recomendado.";
        } else {
            estrategia += " Em distâncias curtas, a aceleração imediata é vital. Maximize a velocidade nas curvas para ganhar vantagem sobre os concorrentes.";
        }

        if (luminosidade > 70000) {
            estrategia += " Em condições de alta luminosidade, verifique os sistemas de iluminação do carro. Uma boa visibilidade é essencial para a segurança e o desempenho.";
        } else {
            estrategia += " Com baixa luminosidade, manter um foco constante e preciso é crucial. Considere estratégias defensivas nas curvas.";
        }

        boxAlgoritmo.innerHTML = `<p>${estrategia}</p>`;

    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para buscar os dados ao carregar a página
fetchData();
