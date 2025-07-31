
function createMovieSection(title, movies, parentContainer) {
    const genreSection = document.createElement('div');
    genreSection.className = 'genre-section';

    const genreTitle = document.createElement('h2');
    genreTitle.className = 'genre-title';
    genreTitle.innerHTML = title;
    genreSection.appendChild(genreTitle);

    const moviesScrollContainer = document.createElement('div');
    moviesScrollContainer.className = 'movies-horizontal-scroll';

    movies.forEach(movie => {
        const moviePosterCard = createMoviePosterCard(movie);
        moviesScrollContainer.appendChild(moviePosterCard);
    });

    genreSection.appendChild(moviesScrollContainer);
    parentContainer.appendChild(genreSection);
}

function createMoviePosterCard(movieData) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-item';

    const movieImage = document.createElement('img');
    movieImage.src = movieData.posterPath ? `https://image.tmdb.org/t/p/w300${movieData.posterPath}` : 'https://via.placeholder.com/200x300?text=No+Image';
    movieImage.alt = movieData.title;

    movieCard.appendChild(movieImage);

    movieCard.addEventListener('click', () => openMovieDetailsModal(movieData));

    return movieCard;
}

async function openMovieDetailsModal(movieData) {
    const modal = document.getElementById('movie-modal');
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"

    document.getElementById('modal-movie-title').textContent = movieData.title;
    document.getElementById('modal-movie-poster').src = movieData.posterPath ? `https://image.tmdb.org/t/p/w500${movieData.posterPath}` : 'https://via.placeholder.com/300x450?text=No+Image';
    document.getElementById('modal-movie-release-date').innerHTML = `<i class="material-icons">event</i> Lançamento: ${movieData.releaseDate || 'N/A'}`;
    document.getElementById('modal-movie-overview').innerHTML = `<i class="material-icons">description</i> Sinopse: ${movieData.overview || 'N/A'}`;
    document.getElementById('modal-movie-duration').innerHTML = `<i class="material-icons">hourglass_empty</i> Duração: ${movieData.duration ? movieData.duration + ' minutos' : 'N/A'}`;
    document.getElementById('modal-movie-rating').innerHTML = `<i class="material-icons">star_half</i> Avaliação: ${movieData.rating ? movieData.rating.toFixed(1) + '/10' : 'N/A'}`;
    document.getElementById('modal-movie-genres').innerHTML = `<i class="material-icons">category</i> Gêneros: ${movieData.genres && movieData.genres.length > 0 ? movieData.genres.map(g => g.name).join(', ') : 'N/A'}`;


    const watchButton = document.getElementById('modal-watch-button');
    watchButton.onclick = () => {
        openVideoIframe(movieData.link);

    };
    modal.showModal();
}

function openVideoIframe(videoLink) {
    document.body.style.overflow = "hidden"
    const videoIframeContainer = document.getElementById('video-iframe-container');
    const videoIframe = document.getElementById('video-iframe');
    videoIframe.src = videoLink;
    videoIframeContainer.style.display = 'flex';
    document.getElementById('movie-modal').close();
}

async function loadMoviesInSections(moviesData) {
    const genresContainer = document.getElementById('genres-container');
    genresContainer.innerHTML = '';

    const uniqueGenres = new Map();
    moviesData.forEach(movie => {
        if (movie.genres) {
            movie.genres.forEach(genre => {
                if (!uniqueGenres.has(genre.id)) {
                    uniqueGenres.set(genre.id, genre.name);
                }
            });
        }
    });


    for (const [genreId, genreName] of uniqueGenres.entries()) {
        const moviesInGenre = moviesData.filter(movie =>
            movie.genres && movie.genres.some(g => g.id === genreId)
        );
        if (moviesInGenre.length > 0) {
            createMovieSection(genreName, moviesInGenre, genresContainer);
        }
    }
}

async function filterMovies(query, allMoviesData) {
    const genresContainer = document.getElementById('genres-container');
    genresContainer.innerHTML = '';

    if (query.trim() === '') {
        await loadMoviesInSections(allMoviesData);
        return;
    }

    const filteredMovies = allMoviesData.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredMovies.length > 0) {
        createMovieSection('Resultados da Pesquisa', filteredMovies, genresContainer);
    } else {
        const noResults = document.createElement('p');
        noResults.textContent = 'Nenhum filme encontrado para sua pesquisa.';
        noResults.style.textAlign = 'center';
        noResults.style.marginTop = '50px';
        noResults.style.fontSize = '20px';
        genresContainer.appendChild(noResults);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let allMoviesData = [];

    const response = await fetch('movies.json');
    allMoviesData = await response.json();

    const filmCount = document.querySelector('.filmCount');
    filmCount.innerHTML = `Total de filmes: ${allMoviesData.length}`;

    await loadMoviesInSections(allMoviesData);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        filterMovies(searchInput.value, allMoviesData);
    });

    document.getElementById('movie-modal').addEventListener('close', () => {
        document.body.style.overflow = "auto"
    });

    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('movie-modal').close();
        document.getElementById('movie-modal').style.display = "none";
    });

    document.getElementById('close-video-button').addEventListener('click', () => {
        const videoIframeContainer = document.getElementById('video-iframe-container');
        const videoIframe = document.getElementById('video-iframe');
        videoIframe.src = '';
        videoIframeContainer.style.display = 'none';
    });
});