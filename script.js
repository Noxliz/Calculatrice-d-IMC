document.getElementById('bmi-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    
    // Validate inputs
    if (!weight || !height || weight <= 0 || height <= 0) {
        showResult('Veuillez entrer des valeurs valides', 'error');
        return;
    }
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to m
    
    // Calculate BMI
    const bmi = weightNum / (heightNum * heightNum);
    
    // Interpret result with more categories
    let interpretation = '';
    let category = '';
    if (bmi < 16.5) {
        interpretation = 'Dénutrition';
        category = 'underweight-severe';
    } else if (bmi >= 16.5 && bmi < 18.5) {
        interpretation = 'Maigreur';
        category = 'underweight-moderate';
    } else if (bmi >= 18.5 && bmi < 25) {
        interpretation = 'Poids normal';
        category = 'normal';
    } else if (bmi >= 25 && bmi < 30) {
        interpretation = 'Surpoids';
        category = 'overweight';
    } else if (bmi >= 30 && bmi < 35) {
        interpretation = 'Obésité modérée';
        category = 'obese-1';
    } else if (bmi >= 35 && bmi < 40) {
        interpretation = 'Obésité sévère';
        category = 'obese-2';
    } else {
        interpretation = 'Obésité morbide';
        category = 'obese-3';
    }
    
    // Display detailed result
    // Calcul du poids idéal (formule de Lorentz)
    const idealWeight = (heightNum * 100 - 100) - ((heightNum * 100 - 150) / 4);
    
    showResult(`
        <p><strong>Votre IMC:</strong> ${bmi.toFixed(1)}</p>
        <p><strong>Interprétation:</strong> ${interpretation}</p>
        <p><strong>Catégorie:</strong> ${category.replace(/-/g, ' ')}</p>
        <p><strong>Poids idéal estimé:</strong> ${idealWeight.toFixed(1)} kg</p>
    `, category, bmi, interpretation);
});

// Stocke le résultat dans l'historique
function storeResult(bmi, interpretation) {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    history.unshift({
        date: new Date().toLocaleString(),
        bmi: bmi.toFixed(1),
        interpretation,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value
    });
    localStorage.setItem('bmiHistory', JSON.stringify(history.slice(0, 10))); // Garde seulement les 10 derniers
}

// Affiche l'historique
function showHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    if (history.length > 0) {
        return `<div class="history">
            <h3>Historique (10 derniers)</h3>
            ${history.map(item => `
                <div class="history-item ${item.interpretation.toLowerCase().replace(' ', '-')}">
                    <span>${item.date}</span>
                    <span>Poids: ${item.weight}kg</span>
                    <span>Taille: ${item.height}cm</span>
                    <span>IMC: ${item.bmi}</span>
                    <span>${item.interpretation}</span>
                </div>
            `).join('')}
        </div>`;
    }
    return '';
}

function showResult(message, category, bmi, interpretation) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = message + showHistory();
    resultElement.className = category;
    storeResult(bmi, interpretation);
}

// Reset functionality
document.getElementById('reset-btn').addEventListener('click', function() {
    document.getElementById('bmi-form').reset();
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '';
    resultElement.className = '';
});
