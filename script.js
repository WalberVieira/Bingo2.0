// Adiciona os listeners de eventos para os botões
document.getElementById('createRoomBtn').addEventListener('click', createRoom); // Quando o botão "Criar Sala" é clicado, chama a função createRoom
document.getElementById('showJoinRoomBtn').addEventListener('click', showJoinRoom); // Quando o botão "Entrar em uma Sala" é clicado, chama a função showJoinRoom
document.getElementById('joinRoomBtn').addEventListener('click', joinRoom); // Quando o botão "Entrar" no joinRoomDiv é clicado, chama a função joinRoom
document.getElementById('leaveRoomBtn').addEventListener('click', leaveRoom); // Quando o botão "Sair da Sala" é clicado, chama a função leaveRoom
document.getElementById('sendMessageBtn').addEventListener('click', sendMessage); // Quando o botão "Enviar" é clicado, chama a função sendMessage
document.getElementById('openBingoCardBtn').addEventListener('click', openBingoCard); // Quando o botão "Abrir Cartela de Bingo" é clicado, chama a função openBingoCard
document.getElementById('drawNumberBtn').addEventListener('click', drawNumber); // Quando o botão "Sortear Número" é clicado, chama a função drawNumber
document.getElementById('checkBingoCardBtn').addEventListener('click', checkBingoCard); // Quando o botão "Verificar Cartela" é clicado, chama a função checkBingoCard

// Variáveis globais
let participants = []; // Lista de participantes
let drawnNumbers = []; // Números sorteados
let bingoCards = {}; // Cartelas de bingo
let creatorName = ''; // Nome do criador da sala
let currentUserName = ''; // Nome do usuário atual

// Quando o DOM estiver carregado, esconde as divisões iniciais
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('roomDiv').classList.add('hidden'); // Esconde a divisão da sala
    document.getElementById('bingoDiv').classList.add('hidden'); // Esconde a divisão do bingo
    document.getElementById('joinRoomDiv').classList.add('hidden'); // Esconde a divisão de entrar na sala
});

// Função para criar uma sala
function createRoom() {
    const name = document.getElementById('nameInput').value.trim(); // Obtém o nome do usuário
    if (!name) {
        alert('Por favor, insira seu nome.'); // Exibe um alerta se o nome estiver vazio
        return;
    }
    creatorName = name; // Define o criador da sala
    currentUserName = name; // Define o usuário atual
    const roomId = generateRoomId(); // Gera um ID de sala
    document.getElementById('currentRoomId').textContent = roomId; // Exibe o ID da sala
    addParticipant(name); // Adiciona o criador como participante
    showRoomDiv(); // Mostra a divisão da sala
    showCreatorControls(true); // Mostra os controles do criador
}

// Função para mostrar a divisão de entrar na sala
function showJoinRoom() {
    document.getElementById('joinRoomDiv').classList.remove('hidden'); // Mostra a divisão de entrar na sala
}

// Função para entrar em uma sala
function joinRoom() {
    const name = document.getElementById('nameInput').value.trim(); // Obtém o nome do usuário
    const roomId = document.getElementById('roomIdInput').value.trim(); // Obtém o ID da sala
    if (!name || !roomId) {
        document.getElementById('roomStatus').textContent = 'Por favor, insira um nome e um ID de sala válido.'; // Exibe uma mensagem de erro se o nome ou o ID da sala estiverem vazios
        return;
    }
    currentUserName = name; // Define o usuário atual
    document.getElementById('currentRoomId').textContent = roomId; // Exibe o ID da sala
    addParticipant(name); // Adiciona o usuário como participante
    showRoomDiv(); // Mostra a divisão da sala
    showCreatorControls(false); // Esconde os controles do criador
}

// Função para sair da sala
function leaveRoom() {
    participants = []; // Limpa a lista de participantes
    drawnNumbers = []; // Limpa a lista de números sorteados
    bingoCards = {}; // Limpa as cartelas de bingo
    updateParticipantsList(); // Atualiza a lista de participantes
    updateDrawnNumbers(); // Atualiza os números sorteados
    document.getElementById('initialView').classList.remove('hidden'); // Mostra a vista inicial
    document.getElementById('roomDiv').classList.add('hidden'); // Esconde a divisão da sala
    document.getElementById('bingoDiv').classList.add('hidden'); // Esconde a divisão do bingo
    document.getElementById('joinRoomDiv').classList.add('hidden'); // Esconde a divisão de entrar na sala
}

// Função para adicionar um participante
function addParticipant(name) {
    participants.push(name); // Adiciona o nome do participante à lista de participantes
    updateParticipantsList(); // Atualiza a lista de participantes
}

// Função para atualizar a lista de participantes
function updateParticipantsList() {
    const participantsList = document.getElementById('participantsList'); // Obtém o elemento da lista de participantes
    participantsList.innerHTML = ''; // Limpa o conteúdo da lista
    participants.forEach(participant => {
        const li = document.createElement('li'); // Cria um novo elemento de lista
        li.textContent = participant; // Define o texto do elemento de lista
        participantsList.appendChild(li); // Adiciona o elemento de lista à lista de participantes
    });
}

// Função para enviar uma mensagem
function sendMessage() {
    const messageInput = document.getElementById('messageInput'); // Obtém o campo de entrada de mensagem
    const message = messageInput.value.trim(); // Obtém o valor do campo de entrada e remove espaços em branco
    if (message) {
        const messageElement = document.createElement('div'); // Cria um novo elemento de div
        messageElement.textContent = `${currentUserName}: ${message}`; // Define o texto do elemento de div com o nome do usuário e a mensagem
        document.getElementById('messages').appendChild(messageElement); // Adiciona o elemento de div à lista de mensagens
        messageInput.value = ''; // Limpa o campo de entrada de mensagem
    }
}

// Função para abrir uma cartela de bingo
function openBingoCard() {
    const cardId = generateRoomId(); // Gera um ID de cartela
    const card = generateBingoCard(); // Gera uma cartela de bingo
    bingoCards[cardId] = card; // Armazena a cartela no objeto de cartelas de bingo
    const bingoCardDiv = document.getElementById('bingoCard'); // Obtém o elemento da cartela de bingo
    bingoCardDiv.innerHTML = ''; // Limpa o conteúdo da cartela de bingo
    card.forEach(row => {
        row.forEach(number => {
            const cell = document.createElement('div'); // Cria um novo elemento de div para cada célula da cartela
            cell.textContent = number === 0 ? 'FREE' : number; // Define o texto da célula (FREE para a célula do meio)
            cell.className = 'bingo-cell'; // Define a classe da célula
            bingoCardDiv.appendChild(cell); // Adiciona a célula à cartela de bingo
        });
    });
    document.getElementById('bingoCardId').textContent = cardId; // Exibe o ID da cartela
    document.getElementById('bingoDiv').classList.remove('hidden'); // Exibe a divisão do bingo
}

// Função para gerar uma cartela de bingo
function generateBingoCard() {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1); // Cria uma array de números de 1 a 75
    const card = [];
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            if (i === 2 && j === 2) {
                row.push(0); // Adiciona um 0 na célula do meio (FREE)
            } else {
                const randomIndex = Math.floor(Math.random() * numbers.length); // Gera um índice aleatório
                row.push(numbers.splice(randomIndex, 1)[0]); // Adiciona o número aleatório à linha e remove-o da array de números
            }
        }
        card.push(row); // Adiciona a linha à cartela
    }
    return card; // Retorna a cartela
}

// Função para sortear um número
function drawNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1; // Gera um número aleatório entre 1 e 75
    } while (drawnNumbers.includes(number)); // Repete até que o número não esteja na lista de números sorteados
    drawnNumbers.push(number); // Adiciona o número à lista de números sorteados
    updateDrawnNumbers(); // Atualiza a lista de números sorteados na interface
    alert(`Número sorteado: ${number}`); // Exibe um alerta com o número sorteado
}

// Função para atualizar os números sorteados
function updateDrawnNumbers() {
    const drawnNumbersDiv = document.getElementById('drawnNumbers'); // Obtém o elemento dos números sorteados
    drawnNumbersDiv.innerHTML = ''; // Limpa o conteúdo do elemento
    drawnNumbers.forEach(number => {
        const numberElement = document.createElement('div'); // Cria um novo elemento de div
        numberElement.textContent = number; // Define o texto do elemento de div com o número sorteado
        numberElement.className = 'drawn-number'; // Define a classe do número sorteado
        drawnNumbersDiv.appendChild(numberElement); // Adiciona o número sorteado ao elemento
    });
}

// Função para verificar uma cartela de bingo
function checkBingoCard() {
    const cardId = prompt('Digite o ID da cartela para verificar:'); // Solicita ao usuário o ID da cartela
    const card = bingoCards[cardId]; // Obtém a cartela pelo ID
    if (!card) {
        alert('Cartela não encontrada.'); // Exibe um alerta se a cartela não for encontrada
        return;
    }
    const hasBingo = checkBingo(card); // Verifica se há bingo na cartela
    if (hasBingo) {
        alert('Bingo!'); // Exibe um alerta se houver bingo
    } else {
        alert('Ainda não há bingo.'); // Exibe um alerta se não houver bingo
    }
}

// Função para verificar se há bingo em uma cartela
function checkBingo(card) {
    // Verifica linhas
    for (let i = 0; i < 5; i++) {
        if (card[i].every(num => num === 0 || drawnNumbers.includes(num))) {
            return true; // Retorna true se todos os números da linha forem 0 ou estiverem na lista de números sorteados
        }
    }
    // Verifica colunas
    for (let j = 0; j < 5; j++) {
        if (card.every(row => row[j] === 0 || drawnNumbers.includes(row[j]))) {
            return true; // Retorna true se todos os números da coluna forem 0 ou estiverem na lista de números sorteados
        }
    }
    // Verifica diagonais
    if (card.every((row, i) => row[i] === 0 || drawnNumbers.includes(row[i]))) {
        return true; // Retorna true se todos os números da diagonal principal forem 0 ou estiverem na lista de números sorteados
    }
    if (card.every((row, i) => row[4 - i] === 0 || drawnNumbers.includes(row[4 - i]))) {
        return true; // Retorna true se todos os números da diagonal secundária forem 0 ou estiverem na lista de números sorteados
    }
    return false; // Retorna false se não houver bingo
}

// Função para gerar um ID de sala
function generateRoomId() {
    return Math.random().toString(36).substr(2, 9); // Gera um ID aleatório
}

// Função para mostrar os controles do criador
function showCreatorControls(isCreator) {
    const creatorControls = document.querySelectorAll('.creator-only'); // Obtém todos os elementos com a classe creator-only
    creatorControls.forEach(control => {
        control.style.display = isCreator ? 'block' : 'none'; // Exibe ou esconde os controles com base no parâmetro isCreator
    });
}

// Função para mostrar a divisão da sala
function showRoomDiv() {
    document.getElementById('initialView').classList.add('hidden'); // Esconde a vista inicial
    document.getElementById('roomDiv').classList.remove('hidden'); // Mostra a divisão da sala
    document.getElementById('bingoDiv').classList.add('hidden'); // Esconde a divisão do bingo inicialmente
}
