const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')

let moviesArray = [{}]

function search(movieName){
    fetch(`http://www.omdbapi.com/?apikey=e4b359c9&s=${movieName}`)
    .then(response => response.json())
    .then(data => {
        moviesArray = data.Search
        console.log(moviesArray)
        document.getElementById('film-icon-placeholder').style.display = "none"
    })
    
    
    
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("Search for " + searchBox.value)
    search(searchBox.value)
})