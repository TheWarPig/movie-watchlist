const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')
const movieContainer = document.getElementById('movie-container')


let moviesHtml = ''
async function search(movieName){
    const response = await fetch(`https://www.omdbapi.com/?apikey=e4b359c9&s=${movieName}`)
    const data = await response.json()
    const moviesArray = data.Search
    console.log(moviesArray)
    
    const fetchMovies = moviesArray.map(movie => {
        return fetch(`https://www.omdbapi.com/?apikey=e4b359c9&i=${movie.imdbID}&type=movie&plot=short`)
            .then(response => response.json())
            .then(data => {
                moviesHtml += `
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
                                <p class="watchlist-div" id="watchlist-div" data-movieid=${data.imdbID} data-movie-name="${data.Title}">
                                    <i class="fa-solid fa-circle-plus"></i>
                                    Watchlist
                                </p>
                            </div>
                            <p class="movie-desc">
                                ${data.Plot}
                            </p>
                        </div>
                    </div>
                `
            })
    })

    await Promise.all(fetchMovies)
    movieContainer.innerHTML = moviesHtml
    document.querySelectorAll('.watchlist-div').forEach(node => {
        node.addEventListener('click', (e) =>{
            const movieId = e.target.dataset.movieid
            const movieName = e.target.dataset.movieName
            // const moveName = e.target.
            let watchlist = getWatchlist()

            // Add the movieId to the watchlist array if it's not already in there
            if (!watchlist.includes(movieId)) {
                watchlist.push(movieId)
                alert(`${movieName} was added to the watchlist`)
            }
            else {
                alert(`${movieName} is already in the watchlist`)
            }

            // Save the updated watchlist back to local storage
            saveWatchlist(watchlist)

            
            
        })
    })
}
        
// Function to retrieve watchlist from local storage or create an empty array if it doesn't exist
function getWatchlist() {
    const watchlist = localStorage.getItem('watchlist')
    return watchlist ? JSON.parse(watchlist) : []
}

// Function to save watchlist to local storage
function saveWatchlist(watchlist) {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
}                

const isWhitespaceString = str => !str.replace(/\s/g, '').length

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!isWhitespaceString(searchBox.value)){
        movieContainer.innerHTML = ''
        search(searchBox.value)
        
    }
    
})