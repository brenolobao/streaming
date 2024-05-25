let nomeFilme = [];
let linkFilme = [];

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            processFileContent(content);
            displayCards();
        };
        reader.readAsText(file);
    }
});

function processFileContent(content) {
    const lines = content.split(/\n\s*\n/).map(line => line.trim()).filter(line => line !== "");
    for (let i = 0; i < lines.length; i += 2) {
        nomeFilme.push(lines[i]);
        if (i + 1 < lines.length) {
            linkFilme.push(lines[i + 1]);
        } else {
            linkFilme.push(''); // Caso onde há um nome de filme sem um link correspondente
        }
    }
}

function displayCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // Limpa o conteúdo anterior

    for (let i = 0; i < nomeFilme.length; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundColor = gerar_cor()

        const title = document.createElement('h3');
        title.textContent = nomeFilme[i];
        card.appendChild(title);

        if (linkFilme[i]) {
            const linkElement = document.createElement('a');
            linkElement.href = linkFilme[i];
            linkElement.textContent = 'Assistir';
            linkElement.target = '_blank'; // Abre o link em uma nova aba
            card.appendChild(linkElement);
        } else {
            const noLinkText = document.createElement('p');
            noLinkText.textContent = 'Link não disponível';
            card.appendChild(noLinkText);
        }

        cardsContainer.appendChild(card);
    }
}
function gerar_cor(opacidade = 1) {
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;

    return `rgba(${r.toFixed(1)}, ${g.toFixed(1)}, ${b.toFixed(1)}, ${opacidade})`;
}
