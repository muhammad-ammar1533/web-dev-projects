const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const pokemonInfo = {
  name: document.getElementById('pokemon-name'),
  id: document.getElementById('pokemon-id'),
  weight: document.getElementById('weight'),
  height: document.getElementById('height'),
  types: document.getElementById('types'),
  hp: document.getElementById('hp'),
  attack: document.getElementById('attack'),
  defense: document.getElementById('defense'),
  specialAttack: document.getElementById('special-attack'),
  specialDefense: document.getElementById('special-defense'),
  speed: document.getElementById('speed'),
  image: document.getElementById('pokemon-image')
};

// Fetch Pokémon data from the API
async function fetchPokemonData(query) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
    if (!response.ok) throw new Error('Pokémon not found');
    const data = await response.json();
    displayPokemonData(data);
  } catch (error) {
    alert("Pokémon not found");
    clearDisplay();
  }
}

// Display Pokémon data in the UI
function displayPokemonData(data) {
  // Display name and ID
  pokemonInfo.name.textContent = data.name.toUpperCase();
  pokemonInfo.id.textContent = `#${data.id}`;

  // Display weight and height as plain values without extra text
  pokemonInfo.weight.textContent = data.weight;
  pokemonInfo.height.textContent = data.height;

  // Display stats in the exact order required
  pokemonInfo.hp.textContent = data.stats[0].base_stat;
  pokemonInfo.attack.textContent = data.stats[1].base_stat;
  pokemonInfo.defense.textContent = data.stats[2].base_stat;
  pokemonInfo.specialAttack.textContent = data.stats[3].base_stat;
  pokemonInfo.specialDefense.textContent = data.stats[4].base_stat;
  pokemonInfo.speed.textContent = data.stats[5].base_stat;

  // Display types with correct format
  pokemonInfo.types.innerHTML = '';
  data.types.forEach(typeInfo => {
    const typeElement = document.createElement('p');
    typeElement.textContent = typeInfo.type.name.toUpperCase();
    pokemonInfo.types.appendChild(typeElement);
  });

  // Display sprite image
  pokemonInfo.image.innerHTML = ''; // Clear any existing image
  const img = document.createElement('img');
  img.id = 'sprite';
  img.src = data.sprites.front_default;
  pokemonInfo.image.appendChild(img);
}

// Clear the display
function clearDisplay() {
  pokemonInfo.name.textContent = '';
  pokemonInfo.id.textContent = '';
  pokemonInfo.weight.textContent = '';
  pokemonInfo.height.textContent = '';
  pokemonInfo.types.innerHTML = '';
  pokemonInfo.hp.textContent = '';
  pokemonInfo.attack.textContent = '';
  pokemonInfo.defense.textContent = '';
  pokemonInfo.specialAttack.textContent = '';
  pokemonInfo.specialDefense.textContent = '';
  pokemonInfo.speed.textContent = '';
  pokemonInfo.image.innerHTML = '';
}

// Event listener for search button
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchPokemonData(query);
  }
});