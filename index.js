/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)
let globalList = [...GAMES_JSON]



// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    games.forEach((game, index) => {
        // create a new div element, which will become the game card
        const newDiv = document.createElement("div")
        
        // add the class game-card to the list
        newDiv.classList.add("game-card")
        newDiv.setAttribute("index", index)
        
        // set the inner HTML using a template literal to display some info 
        // about each game
        const gameDisplay = `
            <img class="game-img" src="${game.img}"/>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p><strong>Backers:</strong> ${game.backers}</p>
        `
        
        newDiv.innerHTML = gameDisplay
        
        // append the game to the games-container
        gamesContainer.appendChild(newDiv)
    });
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")
}
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

const gameModal = document.getElementById("modals-container")

const gameModalCard = document.querySelector(".game-modal")
function attachCardListeners() {
    const gameCards = document.querySelectorAll(".game-card");
    gameCards.forEach((gameCard) => {
        gameCard.addEventListener("click", (event) => {
            const gameIndex = event.currentTarget.getAttribute("index");
            const game = globalList[gameIndex];
            gameModal.style.display = "block";

            const exitDisplay = `<span class="close-btn">&times;</span>`
            const moreInfoDisplay = `
                <p><strong>Pledged:</strong> $${game.pledged}</p>
                <p><strong>Goal:</strong> $${game.goal}</p>
            `;
            gameModalCard.innerHTML = exitDisplay + gameCard.innerHTML + moreInfoDisplay;
        });
    });
}

addGamesToPage(globalList)
attachCardListeners()
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers
}, 0)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const contribDisplay = `
    <p>${totalContributions.toLocaleString('en-US')}</p>
`
contributionsCard.innerHTML = contribDisplay

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged
},0)

// set inner HTML using template literal
const raisedDisplay = `
    <p>$${totalRaised.toLocaleString('en-US')}</p>
`
raisedCard.innerHTML = raisedDisplay

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.reduce((acc,game) => {
    return acc+1
},0)

const gamesDisplay = `
    <p>${totalGames}</p>
`

gamesCard.innerHTML = gamesDisplay


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listUnfunded = GAMES_JSON.filter((game)=>{
        return game.pledged < game.goal
    })

    // use the function we previously created to add the unfunded games to the DOM
    globalList = listUnfunded
    addGamesToPage(listUnfunded)
    attachCardListeners()
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listFunded = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal
    })

    // use the function we previously created to add unfunded games to the DOM
    globalList = listFunded
    addGamesToPage(listFunded)
    attachCardListeners()
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    globalList = GAMES_JSON
    addGamesToPage(GAMES_JSON)
    attachCardListeners()
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly)
fundedBtn.addEventListener("click", filterFundedOnly)
allBtn.addEventListener("click", showAllGames)

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const listUnfunded = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal
})

// create a string that explains the number of unfunded games using the ternary operator
const unFundedStr = `
    A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${totalGames > 1 ? `${totalGames} games` : `${totalGames} game`}. Currently, 
    ${listUnfunded.length > 1 ? `${listUnfunded.length} games remain` : `${listUnfunded.length} game remains`}
    unfunded. We need your help funding these amazing games! 
`

// create a new DOM element containing the template string and append it to the description container
const newElem = document.createElement("p")
newElem.innerHTML = unFundedStr

descriptionContainer.appendChild(newElem)

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ..._others] = sortedGames
// create a new element to hold the name of the top pledge game, then append it to the correct element
const newP = document.createElement("p")
const firstNameDisplay = `
    <p>${firstGame.name}</p>
`
newP.innerHTML = firstNameDisplay

firstGameContainer.appendChild(newP)
// do the same for the runner up item
const newP2 = document.createElement("p")
const secondNameDisplay = `
    <p>${secondGame.name}</p>
`
newP2.innerHTML = secondNameDisplay

secondGameContainer.appendChild(newP2)

/****************************************
 * Customization 
 */


gameModalCard.addEventListener("click", (event) => {
    if (event.target.classList.contains("close-btn")) {
      gameModal.style.display = "none";
    }
});


function searchGame (){
    const gameSearch = document.getElementById("search-bar").value
    const gameFound = GAMES_JSON.filter((game) => {
        return game.name === gameSearch
    })
    if (gameFound.length > 0){
        const {name, description, pledged, goal, backers, img} = gameFound[0];
        const gameDisplay = `
            <span class="close-btn">&times;</span>
            <img class="game-img" src="${img}"/>
            <h3>${name}</h3>
            <p>${description}</p>
            <p><strong>Backers:</strong> ${backers}</p>
            <p><strong>Pledged:</strong> ${pledged}</p>
            <p><strong>Goal:</strong> ${goal}</p>
        `
        gameModal.style.display = "block"
        gameModalCard.innerHTML = gameDisplay
    } else {
        gameModal.style.display = "block"
        gameModalCard.innerHTML = `
            <span class="close-btn">&times;</span>
            <p>No game found with the name ${gameSearch}</p>
        `
    }
}
const searchBtn = document.getElementById('search-btn')
searchBtn.addEventListener("click", searchGame)



