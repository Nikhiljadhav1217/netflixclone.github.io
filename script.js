//consts
const apikey = 'b704de379ad45e1abd1eac43fec5239a'
const apiendpoint = 'https://api.themoviedb.org/3'
const imgPath = 'https://image.tmdb.org/t/p/original'

const apiPaths = {
  fetchAllCategories: `${apiendpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiendpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiendpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyDD8EvIMQKaN7JhYv2fZ94WhYsbneFBo1E`,
}

function init() {
  fetchTrendingMovies()
  fetchAndBuildAllSection()
}

function fetchTrendingMovies() {
  fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length)
      buildBannerSection(list[randomIndex])
    })
    .catch((err) => {
      console.error(err)
    })
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById('banner-section')
  bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`

  const div = document.createElement('div')
  div.innerHTML = `
  <h2 class="banner__title">${movie.title}</h2>
        <p class="banner__info">Trending in movies | Released date - ${movie.release_date}</p>
        <p class="banner__overview">${movie.overview}</p>
        <div class="action-buttons-cont">
          <button class="action-button">Play</button
          ><button class="action-button">More Info</button>
        </div>`

  div.className = 'banner-content container'
  bannerCont.append(div)
}

function fetchAndBuildAllSection() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          )
        })
      }
      //   console.table(movies)
    })
    .catch((err) => console.error(err))
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName)
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      //   console.table(res.results)
      const movies = res.results
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName)
      }
      return movies
    })
    .catch((err) => console.error(err))
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName)

  const moviesCont = document.getElementById('movies-cont')

  const moviesListHTML = list
    .map((item) => {
      return `<img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />`
    })
    .join('')

  const moviesSectionHTML = `
  <h2 class="movie-section-heading">
          ${categoryName} 
        </h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>`

  console.log(moviesSectionHTML)

  const div = document.createElement('div')
  div.className = 'movies-section'
  div.innerHTML = moviesSectionHTML

  //append html into container
  moviesCont.append(div)
}

function searchMoviesTrailer(movieName) {
  if (!movieName) return

  fetch
}

window.addEventListener('load', function () {
  init()
  window.addEventListener('scroll', function () {
    //header ui update
    const header = this.document.getElementById('header')
    if (window.scrollY > 5) header.classList.add('black-bg')
    else header.classList.remove('black-bg')
  })
})
