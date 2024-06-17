const mapContainer = document.getElementById('mapContainer');

for (const territoryObject of territoryData) {
  const territory = document.createElement('div');
  territory.classList.add('territory');

  // Load the SVG image asynchronously
  fetch(territoryObject.imageURL)
    .then(response => response.text())
    .then(svgContent => {
      territory.innerHTML = svgContent;

      // Set absolute position based on coordinates
      territory.style.position = 'absolute';
      territory.style.left = territoryObject.x + 'px';
      territory.style.top = territoryObject.y + 'px';

      mapContainer.appendChild(territory);
    })
    .catch(error => console.error('Error loading SVG:', error));
}