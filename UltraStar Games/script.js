const inventoryInterface = document.getElementById('inventory-interface');
const adminInterface = document.getElementById('admin-interface');
const viewInventoryBtn = document.getElementById('view-inventory-btn');
const viewAdminBtn = document.getElementById('view-admin-btn');


viewInventoryBtn.addEventListener('click', () => {
    inventoryInterface.style.display = 'block';
    adminInterface.style.display = 'none';
    
    
    viewInventoryBtn.classList.add('active-nav');
    viewAdminBtn.classList.remove('active-nav');
});

viewAdminBtn.addEventListener('click', () => {
    inventoryInterface.style.display = 'none';
    adminInterface.style.display = 'block';
    
    
    viewAdminBtn.classList.add('active-nav');
    viewInventoryBtn.classList.remove('active-nav');
});



const addBtn = document.getElementById('add-game-btn');
const gameList = document.getElementById('game-list');
const totalValueDisplay = document.getElementById('total-value');

const titleInput = document.getElementById('game-title');
const platformInput = document.getElementById('game-platform');
const priceInput = document.getElementById('game-price');


let inventory = JSON.parse(localStorage.getItem('myGameStore')) || [];


displayInventory();


addBtn.addEventListener('click', function() {
    const title = titleInput.value.trim();
    const platform = platformInput.value;
    const price = parseFloat(priceInput.value);

    if (!title || !platform || isNaN(price) || price < 0) {
        alert("Please fill in all fields with valid information!");
        return;
    }

    
    const existingGame = inventory.find(g => 
        g.title.toLowerCase() === title.toLowerCase() && g.platform === platform
    );

    if (existingGame) {
        existingGame.amount += 1;
    } else {
        inventory.push({
            id: Date.now(),
            title: title,
            platform: platform,
            price: price.toFixed(2),
            amount: 1
        });
    }

    saveAndRefresh();

    
    titleInput.value = '';
    platformInput.value = '';
    priceInput.value = '';
});


function updateAmount(id, newAmount) {
    const game = inventory.find(g => g.id === id);
    if (game) {
        const val = parseInt(newAmount);
        
        if (val <= 0) {
            
            if(confirm("Stock is 0. Remove this game from inventory?")) {
                inventory = inventory.filter(g => g.id !== id);
            } else {
                game.amount = 1; 
            }
        } else {
            game.amount = val;
        }
        
        saveAndRefresh();
    }
}


function deleteGame(id) {
    
    const userConfirmed = confirm("Are you sure you want to remove this game?");
    
    if (userConfirmed) {
        inventory = inventory.filter(g => g.id !== id);
        saveAndRefresh();
    }
}


function saveAndRefresh() {
    localStorage.setItem('myGameStore', JSON.stringify(inventory));
    displayInventory();
    calculateTotalValue();
}


function displayInventory() {
    gameList.innerHTML = '';

    inventory.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        gameCard.innerHTML = `
            <h3>${game.title}</h3>
            <p><strong>Platform:</strong> ${game.platform}</p>
            <p><strong>Price:</strong> $${game.price}</p>
            <p>
                <strong>Stock:</strong> 
                <input type="number" 
                       class="amount-input" 
                       value="${game.amount}" 
                       onchange="updateAmount(${game.id}, this.value)">
            </p>
            <button class="sold-btn" onclick="deleteGame(${game.id})">Remove Item</button>
        `;
        gameList.appendChild(gameCard);
    });
}


function calculateTotalValue() {
    const total = inventory.reduce((sum, game) => {
        return sum + (parseFloat(game.price) * game.amount);
    }, 0);

    totalValueDisplay.innerText = `$${total.toFixed(2)}`;
}


calculateTotalValue();