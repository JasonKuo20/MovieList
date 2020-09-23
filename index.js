const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12
const movies = [];
//儲存符合篩選條件的項目
let filteredMovies = []

// showMode 1 = card, 2 = list
let showMode = 1
// 記住目前的頁數
let nowPage = 1


const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")
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


function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  nowPage = page
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some((movie => movie.id === id))) { //陣列裡有無此資料
    return alert('此電影已在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  return alert('此電影已加入收藏清單中！')
}

changeMode.addEventListener('click', function onChageModeClicked(event) {
  if (event.target.matches('.cardmode')) {
    showMode = 1
    console.log(showMode)
    renderMovieList(getMoviesByPage(nowPage))
  } else if (event.target.matches('.listmode')) {
    showMode = 2
    console.log(showMode)
    renderMovieList(getMoviesByPage(nowPage))
  }
})


dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-show-favorite')) {
    addToFavorite(Number(event.target.dataset.id));
  }
});


// 監聽分頁器
paginator.addEventListener('click', function onPaginatorCicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

// 監聽Search
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()

  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重新輸出至畫面
  renderMovieList(getMoviesByPage(1))
  renderPaginator(filteredMovies.length)
})


axios
  .get(`https://movie-list.alphacamp.io/api/v1/movies/`)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));