// Fetch food data from the API
// async function fetchFoodData() {
//     try {
//         const response = await axios.get("https://the-mexican-food-db.p.rapidapi.com/", {
//             headers: {
//                 "X-RapidAPI-Key": "f1fd744881msh8c22094926a1e18p10f8e4jsnf92d1e81214b",
//                 "X-RapidAPI-Host": "the-mexican-food-db.p.rapidapi.com",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Failed to fetch food data:", error);
//         throw error; // Propagate the error
//     }
// }

// Function to generate prices within a given range
const boundedPriceGen = (lo, hi) => {
	return Math.floor(Math.random() * (hi - lo) + lo);
};

// Generate random prices for foods
function generatePrices(foods) {
    return foods.map(food => {
        if (food.title.toLowerCase().includes("taco")) {
            return { ...food, price: boundedPriceGen(20, 40) };
        } else if (food.title.toLowerCase().includes("guacamole")) {
            return { ...food, price: boundedPriceGen(15, 40) };
        } else if (food.title.toLowerCase().includes("salad")) {
            return { ...food, price: boundedPriceGen(15, 30) };
        } else {
            return { ...food, price: 0 }; // Default price for other items
        }
    });
}

// Fetch food data from json file (temporary because limited API requests on free plan)
async function fetchFoodData() {
	try {
		const response = await axios.get("js/foods.json");
		return generatePrices(response.data);
	} catch (error) {
		console.error("Failed to fetch food data: ", error);
		throw error;
	}
}

// Filter foods based on keywords
function filterFoodsByKeywords(foods, keywords) {
    return foods.filter(food => keywords.some(keyword => food.title.toLowerCase().includes(keyword)));
}


// Define cart array outside of function scope
const cart = [];


// Function to add items to the cart
function addToCart(food) {
    // Push the selected food item to the cart array //gonna update now

    const findDuplicate = cart.findIndex(item => item.title === food.title);

    if (findDuplicate !== -1) {
        increaseQuantity(food.title)
    } else {
        cart.push(food);
    }  

    // Then update the cart UI
    updateCartUI();
}

// Update the cart UI after adding items to the cart
function updateCartUI() {
    // Select the cart container
    const cartContainer = document.querySelector('#cart-items');
    
    // Clear the cart container before updating
    cartContainer.innerHTML = '';

    //Setting totalCost
    var totalCost = 0;

    // Iterate over each item in the cart
    cart.forEach((food, index) => {
        cart[index].quantity = (cart[index].quantity || 1) //setting initial quantity value to 1
        totalCost += food.price * cart[index].quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('col-12', 'mb-3');
        cartItem.innerHTML = `
            <div class="card p-3 d-flex align-items-center">
                <h5 class="card-title">${food.title}</h5>
                <p class="card-text p-1 mx-1">$${(food.price * cart[index].quantity)}</p>
                <div class="d-flex align-items-center">
                    <button class="btn btn-primary mr-2" onclick="decreaseQuantity('${food.title}')">&#8722;</button>
                    <p class="amount" id="item${index + 1}">${cart[index].quantity}</p>
                    <button class="btn btn-primary ml-2" onclick="increaseQuantity('${food.title}')">&#43;</button>
                    <button class="btn btn-danger ml-auto" onclick="removeItem('${food.title}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg></button>
                </div>
            </div>
        `;
        // Append the cart item to the cart container
        cartContainer.appendChild(cartItem);
        document.getElementById("totalcost").innerHTML = "$" + totalCost;
    });
}

// Increase quantity of an item in the cart
function increaseQuantity(title) {
    const itemIndex = cart.findIndex(food => food.title === title);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + 1;
    }
    updateCartUI();
}

// Decrease quantity of an item in the cart
function decreaseQuantity(title) {
    const itemIndex = cart.findIndex(food => food.title === title);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) - 1;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Remove item if quantity becomes zero
        }
    }
    updateCartUI();
}

// Remove an item from the cart
function removeItem(title) {
    const itemIndex = cart.findIndex(food => food.title === title);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1); // Remove item from cart array
    }
    updateCartUI();
}


// Function to create a food card
function createFoodCard(food) {
    const card = document.createElement('div');
    card.classList.add('col');
    card.innerHTML = `
        <div class="card">
            <img src="${food.image}" class="card-img-top" alt="food card">
            <div class="card-body">
                <h5 class="card-title">${food.title}</h5>
                <p class="card-text">Price: $${food.price}</p>
                <div class="d-flex justify-content-around">
                    <a href="#" class="btn btn-primary">Add To Cart</a>
                </div>
            </div>
        </div>
    `;
    // Add event listener to the "Add To Cart" button
    const addToCartBtn = card.querySelector('.card .btn.btn-primary');
    addToCartBtn.addEventListener('click', () => addToCart(food));
    return card;
}

// Print food items in the DOM
function printFoods(foods) {
    const sections = {
        "taco": document.querySelector("#tacosRow"),
        "guacamole": document.querySelector("#guacamoleRow"),
        "salad": document.querySelector("#saladsRow"),
    };
    
    foods.forEach(food => {
        const sectionId = Object.keys(sections).find(id => food.title.toLowerCase().includes(id));
        if (sectionId) {
            const sectionContainer = sections[sectionId];
            const card = createFoodCard(food);
            sectionContainer.appendChild(card);
        }
    });
}

async function displayMenu() {
    try {
        // Fetch food data from JSON file
        const allFoods = await fetchFoodData();
        
        // Print all the fetched foods
        printFoods(allFoods);
    } catch (error) {
        console.error("Failed to display menu:", error);
    }
}

// Execute main function when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    displayMenu(); // Display menu when DOM content is loaded
});