const searchForm = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')
const movieContainer = document.getElementById('movie-container')
const watchListNumber = document.getElementById('watchlist-num')

let moviesHtml = ''

document.addEventListener('DOMContentLoaded', async function() {
    const watchlist = getWatchlist()
    if(watchlist.length > 0){
        watchListNumber.style.display = 'flex'
        watchListNumber.textContent = watchlist.length
    }
})

async function search(movieName){
    const response = await fetch(`https://www.omdbapi.com/?apikey=e4b359c9&s=${movieName}&type=movie`)
    const data = await response.json()
    if(!data.Error){
        const watchlist = getWatchlist()
        moviesHtml = ''
        movieContainer.innerHTML = ''
        const moviesArray = data.Search    
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
                                    ${watchlist.find(id => id === data.imdbID) ?
                                        `<p class="watchlist-div added" id="watchlist-div" data-movieid=${data.imdbID} data-movie-name="${data.Title}">
                                            In watchlist
                                        </p>` :
                                        `<p class="watchlist-div" id="watchlist-div" data-movieid=${data.imdbID} data-movie-name="${data.Title}">
                                                <i class="fa-solid fa-circle-plus" ></i>
                                                Watchlist
                                        </p>`}
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
                const movieId = node.dataset.movieid
                const movieName = node.dataset.movieName
                
                let watchlist = getWatchlist()

                // Add the movieId to the watchlist array if it's not already in there
                if (!watchlist.includes(movieId)) {
                    watchlist.push(movieId)
                    watchListNumber.style.display = 'flex'
                    watchListNumber.textContent = watchlist.length
                    console.log(node)
                    node.innerHTML = `
                            In watchlist
                        `
                    node.classList.add('added')
                }
                
                // Save the updated watchlist back to local storage
                saveWatchlist(watchlist)

                
                
            })
        })
        }
        else{
            movieContainer.innerHTML = `
                <div class="film-icon-placeholder" id="film-icon-placeholder">
                    <div class="no-movies">
                        <h2>Opps! No movies were found</h2>
                        <i class="fa-regular fa-face-frown-open"></i>
                    </div>
                </div>
            `
        }
        
    
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
        // movieContainer.innerHTML = ''
        search(searchBox.value)
        
    }
    else{
        alert("Please enter a valid movie name.")
        searchBox.value = ""
    }
    
})