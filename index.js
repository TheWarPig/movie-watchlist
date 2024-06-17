const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')

let moviesHtml = ''
function search(movieName){
    fetch(`http://www.omdbapi.com/?apikey=e4b359c9&s=${movieName}`)
    .then(response => response.json())
    .then(data => {
        const moviesArray = data.Search
        document.getElementById('film-icon-placeholder').style.display = "none"
        // document.getElementById('movie-container').style.alignItems = "start"
        moviesArray.forEach((movie) => {
            fetch(`http://www.omdbapi.com/?apikey=e4b359c9&i=${movie.imdbID}&plot=short`)
                .then(response => response.json())
                .then(data => {
                        console.log(data)              
                        document.getElementById('movie-container').innerHTML += `
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
    // console.log(moviesHtml)
    // document.getElementById('movie-container').innerHTML = moviesHtml
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    search(searchBox.value)
})