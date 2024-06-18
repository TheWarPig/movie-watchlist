const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')
const movieContainer = document.getElementById('movie-container')


let moviesHtml = ''

// Function to retrieve watchlist from local storage or create an empty array if it doesn't exist
function getWatchlist() {
    const watchlist = localStorage.getItem('watchlist')
    return watchlist ? JSON.parse(watchlist) : []
}

// Function to save watchlist to local storage
function saveWatchlist(watchlist) {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
}                

document.addEventListener('DOMContentLoaded', async function() {
    let watchlist = getWatchlist()
    if (watchlist.length > 0){
        let moviesHtml = ''
        const movieContainer = document.getElementById('movie-container')

        const fetchMovies = watchlist.map(async movie => {
            try {
                const response = await fetch(`https://www.omdbapi.com/?apikey=e4b359c9&i=${movie}&type=movie&plot=short`)
                const data = await response.json()

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
                                <p class="watchlist-div" id="watchlist-div" data-movieid="${data.imdbID}" data-movie-name="${data.Title}">
                                    <i class="fa-solid fa-circle-minus"></i>
                                    Remove
                                </p>
                            </div>
                            <p class="movie-desc">
                                ${data.Plot}
                            </p>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error fetching data for movie ID ${movie}:`, error)
            }
        });

        await Promise.all(fetchMovies)
        movieContainer.innerHTML = moviesHtml;
        document.querySelectorAll('.watchlist-div').forEach(node => {
            node.addEventListener('click', (e) =>{

                const movieId = e.target.dataset.movieid
                const localStorageWatchlist = getWatchlist()
                const newWatchlist = localStorageWatchlist.filter( movie => movie !== movieId)
                saveWatchlist(newWatchlist)
                if (newWatchlist.length === 0){
                    movieContainer.innerHTML = `
                        <div class="film-icon-placeholder" id="film-icon-placeholder">
                            <h2>Your watchlist is looking a little empty...</h2>
                            <a class="add-movies" href="/index.html">
                                <i class="fa-solid fa-circle-plus"></i>
                                <p>Let’s add some movies!</p>
                            </a>
                        </div>
                    `
                }else{
                    e.target.parentElement.parentElement.parentElement.style.display = 'none'
                }
                
                
            })
                
                
        })
    }
    else{
        movieContainer.innerHTML = `
            <div class="film-icon-placeholder" id="film-icon-placeholder">
                <h2>Your watchlist is looking a little empty...</h2>
                <a class="add-movies" href="/index.html">
                    <i class="fa-solid fa-circle-plus"></i>
                    <p>Let’s add some movies!</p>
                </a>
            </div>
            `
    }
})



