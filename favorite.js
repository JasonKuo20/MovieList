const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

// showMode 1 = card, 2 = list
let showMode = 1

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const changeMode = document.querySelector("#change-mode")

// 渲染畫面
function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    if (showMode === 1) {
      rawHTML += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img src="${POSTER_URL + item.image}"
                class="card-img-top" alt="Movie Poster"/>
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer text-muted">
                <button class="btn btn-primary btn-show-movie"
                  data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-show-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>`;
    } else if (showMode === 2) {
      rawHTML += ` <div class="col-12">
        <div class="row py-2 my-1 border border-right-0 border-left-0 d-flex align-items-center">
          <div class="col-10">
            <h5>${item.title}</h5>
          </div>
          <div class="col-2">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-show-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>`
    }
  });
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerHTML = data.title;
    modalDate.innerText = "Release Date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img
                src="${POSTER_URL + data.image}"
                class="img-fluid"
                alt="Movie Poster"
              />`;
  });
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

changeMode.addEventListener('click', function onChageModeClicked(event) {
  if (event.target.matches('.cardmode')) {
    showMode = 1
    console.log(showMode)
    renderMovieList(movies)
  } else if (event.target.matches('.listmode')) {
    showMode = 2
    console.log(showMode)
    renderMovieList(movies)
  }
})

renderMovieList(movies)