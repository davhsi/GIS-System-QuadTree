const mapContainer = document.getElementById('map-container');
const cityNameInput = document.getElementById('city-name');
const locateBtn = document.getElementById('locate-btn');
const deleteBtn = document.getElementById('delete-btn');
const xInput = document.getElementById('x-coord');
const yInput = document.getElementById('y-coord');
const newCityNameInput = document.getElementById('new-city-name');
const addBtn = document.getElementById('add-btn');
const cityList = document.getElementById('city-list');

const quadTree = new QuadTree(new Rectangle(0, 0, 1000, 800));

function plotCity(x, y, name) {
    const cityMarker = document.createElement('div');
    cityMarker.classList.add('city-marker');
    cityMarker.style.left = `${x}px`;
    cityMarker.style.top = `${y}px`;
    cityMarker.dataset.name = name;
    mapContainer.appendChild(cityMarker);

    const cityLabel = document.createElement('div');
    cityLabel.classList.add('city-label');
    cityLabel.textContent = name;
    cityLabel.style.left = `${x + 15}px`;
    cityLabel.style.top = `${y + 15}px`;
    cityLabel.dataset.name = name;

    mapContainer.appendChild(cityLabel);

    const city = { x, y, name };
    quadTree.insert(city);
}

function locateCity(name) {
    const city = quadTree.queryByName(name);

    if (city) {
        const markers = mapContainer.querySelectorAll('.city-marker');
        const labels = mapContainer.querySelectorAll('.city-label');
        markers.forEach(marker => marker.style.backgroundColor = 'green');
        labels.forEach(label => label.style.color = 'black');

        const cityMarker = mapContainer.querySelector(`[data-name="${city.name}"]`);
        const cityLabel = mapContainer.querySelector(`.city-label[data-name="${city.name}"]`);
        cityMarker.style.backgroundColor = 'navy';
        cityLabel.style.color = 'yellow';
        
        alert(`City "${name}" located.`);
    } else {
        const availableCities = quadTree.points.map(city => city.name);
        let message = `City "${name}" not found.`;
        if (availableCities.length > 0) {
            message += ` Available cities: ${availableCities.join(', ')}`;
        }
        alert(message);
    }
}

function deleteCity(name) {
    const city = quadTree.queryByName(name);

    if (city) {
        const cityMarker = mapContainer.querySelector(`[data-name="${city.name}"]`);
        const cityLabel = mapContainer.querySelector(`.city-label[data-name="${city.name}"]`);
        mapContainer.removeChild(cityMarker);
        mapContainer.removeChild(cityLabel);
        quadTree.remove(city);
        alert(`City "${name}" has been deleted.`);
    } else {
        const availableCities = quadTree.points.map(city => city.name);
        let message = `City "${name}" not found.`;
        if (availableCities.length > 0) {
            message += ` Available cities: ${availableCities.join(', ')}`;
        }
        alert(message);
    }
}

addBtn.addEventListener('click', () => {
    const x = parseInt(xInput.value);
    const y = parseInt(yInput.value);
    const name = newCityNameInput.value;

    if (name.trim() !== '') {
        plotCity(x, y, name);
        newCityNameInput.value = '';
    } else {
        alert('Please enter a city name.');
    }
});

locateBtn.addEventListener('click', () => {
    const name = cityNameInput.value;
    locateCity(name);
});

deleteBtn.addEventListener('click', () => {
    const name = cityNameInput.value;
    deleteCity(name);
});
