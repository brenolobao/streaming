document.addEventListener('DOMContentLoaded', async () => {
    const API_KEY = 'b0d688587e00ac9e00c51e95151c53c2';
    const text = await fetch('movies.txt').then(response => response.text());
    const [movieNames, movieLinks] = processLinksFile(text);
    await displayMovies(movieNames, movieLinks, API_KEY);
});

function processLinksFile(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const movieNames = [];
    const movieLinks = [];

    for (let i = 0; i < lines.length; i += 2) {
        movieNames.push(lines[i]);
        movieLinks.push(lines[i + 1]);
    }

    return [movieNames, movieLinks];
}

async function displayMovies(movieNames, movieLinks, apiKey) {
    const moviesContainer = document.getElementById('movies-container');

    for (let i = 0; i < movieNames.length; i++) {
        const movieData = await fetchMovieData(movieNames[i], apiKey);
        if (movieData) {
            const movieCard = createMovieCard(movieData, movieLinks[i]);
            moviesContainer.appendChild(movieCard);
        }
    }
}

async function fetchMovieData(movieName, apiKey) {
    const encodedMovieName = encodeURIComponent(movieName);
    const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodedMovieName}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok && data.results.length > 0) {
            const movie = data.results[0];
            return {
                title: movie.title,
                releaseDate: movie.release_date,
                posterPath: movie.poster_path,
                watchLink: `https://www.themoviedb.org/movie/${movie.id}`
            };
        } else {
            console.error(`Error fetching movie data for "${movieName}": No results found`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching movie data for "${movieName}":`, error);
        return null;
    }
}

function createMovieCard(movieData, movieLink) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w185${movieData.posterPath}`;
    movieImage.alt = movieData.title;

    const movieDetails = document.createElement('div');
    movieDetails.className = 'movie-details';

    const movieTitle = document.createElement('h2');
    movieTitle.className = 'movie-title';
    movieTitle.textContent = movieData.title;

    const movieReleaseDate = document.createElement('p');
    movieReleaseDate.className = 'movie-release-date';
    movieReleaseDate.textContent = `Lançamento: ${movieData.releaseDate}`;

    const watchLink = document.createElement('a');
    watchLink.className = 'watch-link';
    watchLink.href = movieLink; // Utiliza o link fornecido do arquivo de texto
    watchLink.textContent = 'Assistir';

    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(movieReleaseDate);
    movieDetails.appendChild(watchLink);
    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieDetails);

    return movieCard;
}
