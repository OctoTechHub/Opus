// script.js
const map = L.map('map').setView([40.7128, -74.0060], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const blockSize = 0.001; 

function createBlock(lat, lng, id, team) {
    const bounds = [
        [lat, lng],
        [lat + blockSize, lng + blockSize]
    ];
    const block = L.rectangle(bounds, {
        color: '#000',
        weight: 1,
        className: team
    }).addTo(map);
    block.on('click', () => handleBlockClick(id, team));
}

function handleBlockClick(id, team) {
    alert(`Block ID: ${id} clicked. Team: ${team}`);
}

let id = 1;
for (let lat = 40.70; lat < 40.75; lat += blockSize) {
    for (let lng = -74.02; lng < -73.97; lng += blockSize) {
        const team = getRandomTeam();
        createBlock(lat, lng, id, team);
        id++;
    }
}

function getRandomTeam() {
    const teams = ['avengers', 'xmen', 'spiderman', 'ironman', 'captainamerica'];
    return teams[Math.floor(Math.random() * teams.length)];
}

// Add an event listener to the map's drag event
map.on('dragend', () => {
    const center = map.getCenter();
    const nearestBlockLat = Math.round(center.lat / blockSize) * blockSize;
    const nearestBlockLng = Math.round(center.lng / blockSize) * blockSize;
    map.panTo([nearestBlockLat, nearestBlockLng]);
});