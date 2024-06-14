function adjustOddsDynamically(oddsTeam1, oddsTeam2, stakesTeam1, stakesTeam2) {
    const totalStakes = stakesTeam1 + stakesTeam2;
    const shareTeam1 = stakesTeam1 / totalStakes;
    const shareTeam2 = stakesTeam2 / totalStakes;

    // Базовое изменение коэффициента зависит от разницы в долях ставок
    const baseChange = Math.abs(shareTeam1 - shareTeam2);

    // Корректируем коэффициенты в зависимости от долей ставок
    let adjustedOddsTeam1 = oddsTeam1 + baseChange * (shareTeam2 > shareTeam1 ? 1 : -1);
    let adjustedOddsTeam2 = oddsTeam2 + baseChange * (shareTeam1 > shareTeam2 ? 1 : -1);

    // Устанавливаем минимальный и максимальный пороги для коэффициентов
    const minOdds = 1.01;
    const maxOdds = 100; // Пример максимального значения коэффициента для иллюстрации
    adjustedOddsTeam1 = Math.max(minOdds, Math.min(maxOdds, adjustedOddsTeam1));
    adjustedOddsTeam2 = Math.max(minOdds, Math.min(maxOdds, adjustedOddsTeam2));

    return {
        adjustedOddsTeam1: adjustedOddsTeam1.toFixed(3),
        adjustedOddsTeam2: adjustedOddsTeam2.toFixed(3)
    };
}

// Пример использования функции
const oddsTeam1 = 2.0; // Изначальный коэффициент для команды 1
const oddsTeam2 = 2.0; // Изначальный коэффициент для команды 2
const stakesTeam1 = 3; // Сумма ставок на команду 1
const stakesTeam2 = 2.5; // Сумма ставок на команду 2

const adjustedOdds = adjustOddsDynamically(oddsTeam1, oddsTeam2, stakesTeam1, stakesTeam2);

console.log("Adjusted Odds for Team 1: ", adjustedOdds.adjustedOddsTeam1);
console.log("Adjusted Odds for Team 2: ", adjustedOdds.adjustedOddsTeam2);