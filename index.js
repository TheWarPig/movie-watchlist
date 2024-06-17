const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')
const movieContainer = document.getElementById('movie-container')

let moviesHtml = ''
function search(movieName){
    fetch(`https://www.omdbapi.com/?apikey=e4b359c9&s=${movieName}`)
    .then(response => response.json())
    .then(data => {
        const moviesArray = data.Search
        
        moviesArray.forEach((movie) => {
            fetch(`https://www.omdbapi.com/?apikey=e4b359c9&i=${movie.imdbID}&plot=short`)
                .then(response => response.json())
                .then(data => {              
                        movieContainer.innerHTML += `
                            <div class="movie">
                                <div class="poster">
                                    <img
                                        src="${data.Poster}"
                                        onerror="this.src='fallback.jpg'"
                                        alt="poster of the movie ${data.Title}"
                                    />
                                </div>
                                <div class="movie-info">
                                    <div class="movie-header">
                                        <h2>${data.Title}</h2>
                                        <i class="fa-solid fa-star"></i>
                                        <p class="rating">${data.imdbRating}</p>
                                    </div>
                                    <div class="meta-info">
                                        <p>${data.Runtime}</p>
                                        <p>${data.Genre}</p>
                                        <p>Watchlist</p>
                                    </div>
                                    <p class="movie-desc">
                                        ${data.Plot}
                                    </p>
                                </div>
                            </div>
                            `   
                    })
        })
             
    })
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    movieContainer.innerHTML = ''
    search(searchBox.value)
})