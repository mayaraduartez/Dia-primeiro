const fs = require('fs');

// Lê o conteúdo do arquivo texto
fs.readFile('arquivo.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    const lines = data.split('\n');
    const totals = {};

    // Processa cada linha
    lines.forEach(line => {
        // Remove espaços extras
        line = line.trim();
        // Verifica se a linha está vazia
        if (!line) return;

        // Divide a linha em partes
        const parts = line.split(' ');
        // Verifica se há pelo menos dois elementos (nome e valor)
        if (parts.length < 2) return;

        // A primeira parte é o nome
        const name = parts.slice(0, -1).join(' ');
        // A última parte é o valor, tentando parsear como float
        const value = parseFloat(parts[parts.length - 1].replace(',', '.'));

        // Verifica se o valor é um número válido
        if (isNaN(value)) {
            console.warn(`Valor inválido para a linha: "${line}"`);
            return; // Ignora linhas com valor inválido
        }

        // Verifica se o nome já existe no objeto totals
        if (totals[name]) {
            totals[name].values.push(value);
            totals[name].total += value;
        } else {
            totals[name] = { values: [value], total: value };
        }
    });

    // Cria um array para os resultados organizados
    const result = [];
    const categories = {
        '1 Bia': [],
        '2 Bia': [],
        '3 Bia': [],
        'Bc': [],
        'Sgt': [],
        'Outros': [], // Nova categoria para os nomes que não se encaixam
    };

    // Organiza os resultados por categoria
    for (const name in totals) {
        const { values, total } = totals[name];
        if (name.startsWith('1 Bia')) {
            categories['1 Bia'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        } else if (name.startsWith('2 Bia')) {
            categories['2 Bia'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        } else if (name.startsWith('3 Bia')) {
            categories['3 Bia'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        } else if (name.startsWith('Bc')) {
            categories['Bc'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        } else if (name.startsWith('Sgt')) {
            categories['Sgt'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        } else {
            // Qualquer nome que não se encaixa nas categorias pré-definidas vai para "Outros"
            categories['Outros'].push(`${name} ${values.join(' + ')} Total ${total.toFixed(2)}`);
        }
    }

    // Adiciona as categorias ao resultado
    for (const category in categories) {
        if (categories[category].length > 0) {
            result.push(`${category}\n${categories[category].join('\n')}\n`);
        }
    }

    // Total geral
    const grandTotal = Object.values(totals).reduce((sum, { total }) => sum + total, 0);
    result.push(`Total da lista: ${grandTotal.toFixed(2)}`);

    // Salva o resultado em um novo arquivo
    fs.writeFile('resultado.txt', result.join('\n'), err => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
        } else {
            console.log('Resultado salvo em resultado.txt');
        }
    });
});
