const player1 = {
    nome: "Mario",
    velocidade: 4,
    manobrabilidade: 3,
    poder: 3,
    pontos: 0,
    vantagem: "RETA",
};

const player2 = {
    nome: "Luigi",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 4,
    pontos: 0,
    vantagem: "CURVA",
};

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    const random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

function logRollResult(name, type, dice, attribute, bonus = 0) {
    const total = dice + attribute + bonus;
    console.log(`${name} rolou para ${type}: ${dice} + ${attribute}${bonus ? ` + ${bonus} (vantagem)` : ""} = ${total}`);
}

function applyAdvantage(character, block) {
    return character.vantagem === block ? 1 : 0;
}

async function playRacerEngine(c1, c2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`\n🔄 Rodada ${round}`);

        const block = await getRandomBlock();
        console.log(`🏁 Bloco: ${block}`);

        const dice1 = await rollDice();
        const dice2 = await rollDice();

        let total1 = 0, total2 = 0;

        if (block === "RETA" || block === "CURVA") {
            const attribute = block === "RETA" ? "velocidade" : "manobrabilidade";

            const bonus1 = applyAdvantage(c1, block);
            const bonus2 = applyAdvantage(c2, block);

            total1 = dice1 + c1[attribute] + bonus1;
            total2 = dice2 + c2[attribute] + bonus2;

            logRollResult(c1.nome, attribute, dice1, c1[attribute], bonus1);
            logRollResult(c2.nome, attribute, dice2, c2[attribute], bonus2);
        }

        if (block === "CONFRONTO") {
            const power1 = dice1 + c1.poder;
            const power2 = dice2 + c2.poder;

            console.log(`${c1.nome} confrontou ${c2.nome}!`);

            logRollResult(c1.nome, "poder", dice1, c1.poder);
            logRollResult(c2.nome, "poder", dice2, c2.poder);

            if (power1 > power2 && c2.pontos > 0) {
                c2.pontos--;
                console.log(`⚔️ ${c1.nome} venceu o confronto! ${c2.nome} perdeu 1 ponto.`);
            } else if (power2 > power1 && c1.pontos > 0) {
                c1.pontos--;
                console.log(`⚔️ ${c2.nome} venceu o confronto! ${c1.nome} perdeu 1 ponto.`);
            } else if (power1 === power2) {
                console.log("🤝 Confronto empatado! Nenhum ponto perdido.");
            }

            continue; // pula verificação de pontos nesta rodada
        }

        if (total1 > total2) {
            c1.pontos++;
            console.log(`🏆 ${c1.nome} marcou 1 ponto!`);
        } else if (total2 > total1) {
            c2.pontos++;
            console.log(`🏆 ${c2.nome} marcou 1 ponto!`);
        } else {
            console.log("⚖️ Empate! Ninguém marcou ponto.");
        }
    }
}

function declareWinner(c1, c2) {
    console.log(`\n📊 Resultado Final:`);
    console.log(`${c1.nome}: ${c1.pontos} ponto(s)`);
    console.log(`${c2.nome}: ${c2.pontos} ponto(s)`);

    if (c1.pontos > c2.pontos) {
        console.log(`🎉 ${c1.nome} venceu a corrida!`);
    } else if (c2.pontos > c1.pontos) {
        console.log(`🎉 ${c2.nome} venceu a corrida!`);
    } else {
        console.log("🏁 A corrida terminou em empate!");
    }
}

(async function main() {
    console.log(`🚗 Corrida entre ${player1.nome} e ${player2.nome} começando...\n`);
    await playRacerEngine(player1, player2);
    declareWinner(player1, player2);
})();
