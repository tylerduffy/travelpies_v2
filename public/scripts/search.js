function filterDestinations() {
    var input, filter, destinationContainer, destinations, destination, i, keywords;
    input = document.getElementById("destinationSearchInput");
    filter = input.value.toLowerCase();
    destinationContainer = document.getElementById("destinations");
    destinations = destinationContainer.getElementsByClassName("destination-card");
    for (i = 0; i < destinations.length; i++) {
        destination = destinations[i];
        keywords = destination.getAttribute("data-keywords").split(",");
        for (const keyword of keywords) {
            if (keyword.includes(filter)) {
                destination.style.display = "";
                break;
            }
            destination.style.display = "none";
        }
    }
}