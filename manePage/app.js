const filmsListElement = document.querySelector(".films-list");

async function request(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": "c4d6436b-cc98-4454-a1bd-5dd43e31c099",
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

// Создаем карточку фильма
function showFilms(data) {
  filmsListElement.innerHTML = "";

  data.films.forEach((film) => {
    const filmsElement = document.createElement("div");
    filmsElement.classList.add("film-card");
    film ?
    filmsElement.innerHTML = `
      <div class="film-card-preview" style="background-image: url(${
        film.posterUrlPreview
      });">
        <div class="film-card-raiting" style="border-color: ${getRaitingColor(Number(film.rating))}">${film.rating}</div>
      </div>
      <div class="film-card-name">${film.nameRu}</div>
      <div class="film-card-genre">${film.genres
        .map((x) => x.genre)
        .join(", ")}</div>
    `
    : filmsElement.innerHTML = `<div>1111</div>`;

    filmsElement.onclick = function () {
      openFilmModal(film.filmId);
    };

    filmsListElement.appendChild(filmsElement);

    // console.log(film);
    // чем film отличается от data.films.film ?
  });
};

function loadTop100() {
  request(
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1"
  ).then(showFilms);
}

loadTop100();


// Возврат на главную страницу по клику на название сайта
siteName = document.querySelector(".siteName");
siteName.onclick = loadTop100;

// Бордер рейтинга
function getRaitingColor(raiting) {
  if (raiting >= 8) {
    return "rgb(0, 254, 0)";
  } else if (8 > raiting && raiting > 6) {
    return "rgba(251, 251, 0, 0.919)";
  } else {
    return "rgba(251, 54, 0, 0.919)";
  }
}

// Реализуем поиск
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const searchBtn = document.getElementById("btnSearch");
const searchInput = document.getElementById("search-input");

searchBtn.onclick = async function doSearch() {
  const searchValue = searchInput.value;
  showFilms(await request(API_URL_SEARCH + searchValue));
  searchInput.value = "";
};



// Мадольное окно

const getFilmById = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

async function openFilmModal(filmId) {
  const API_URL_ID = getFilmById + filmId;

  let resp = await request(API_URL_ID);

  let staff = await request(
    "https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=" + filmId
  );

  let trailers = await request(
    `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/videos`
  );

  const director = staff[0];

  // Трейлер
  const trailer = trailers.items.find((elem) => elem.site === "YOUTUBE");
  // console.log(trailer);

  const trailerURL =
    trailer &&
    (() => {
      const link = "https://www.youtube.com/embed/";

      const videoUrlElems = trailer.url.split("/");

      const videoId = videoUrlElems[videoUrlElems.length - 1];

      return link + videoId;
    })();

  // Условие показа трейлера
  const trailerContainerString = trailerURL
    ? `<iframe width="300" height="170" src="${trailerURL}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    : "";

  const modalWindowElem = document.querySelector(".modalContainer");
  modalWindowElem.innerHTML = `
  <div class="modalWindow">
  <div class="container">
  <div class="media">
  <div class="film-picture">
    <img class="pictureImg"
      src="${resp.posterUrlPreview}"
      alt="Обложка фильма!"
    />
  </div>

  <div class="film-treiler">
    ${trailerContainerString}
  </div>
</div>

<div class="exit"><img id = "exitt" src="assets/exit.png" /></div>

<div class="textInformation">
  <div class="informationHeader">
    <div class="film-name">
      <h2 class="name">${resp.nameRu}</h2>
      <h4 class="engName">${resp.nameOriginal}</h4>
    </div>

    <div class="scores">
      <div class="imdbScore">
        <div class="imdbLogo">
          <img id="imdbLogo" src="assets/imdb.svg" alt="imdbLogo" />
        </div>
        <div class="imbdScoreValue">${resp.ratingImdb}</div>
      </div>
      <div class="kpScore">
        <div class="kpLogo">
          <img id="kpLogo"src="assets/KinopoiskLogo.svg" alt="kpLogo" />
        </div>
        <div class="kpScoreValue">${resp.ratingKinopoisk}</div>
      </div>
    </div>
  </div>

  <div class="filmInformationBlock">
    <div class="title">
      <h2 class="titleValue">О фильме</h2>
    </div>

    <div class="filmInformation">
      <div class="info dark prodYear">Год производства</div>
      <div class="info dark prodYear-value">${resp.year}</div>

      <div class="info dark genre">Жанр</div>
      <div class="info dark genre-value">боевик</div>

      <div class="info dark producer">Режиссер</div>
      <div class="info dark producer-value">${director.nameRu}</div>

      <div class="info dark budget">Бюджет</div>
      <div class="info dark budget-value">$120 000 000</div>

      <div class="info dark premiere">Премьера в Росcии</div>
      <div class="info dark premiere-value">Дата</div>

      <div class="info dark length">Время</div>
      <div class="info dark length-value">115 мин.</div>
    </div>
  </div>
  <div class="shortDescription">
            <div class="descTitle">Краткое описание</div>
            <div class="descValue">${resp.shortDescription}.</div>
          </div>
</div>
</div>
</div>
`;

  const body = document.querySelector("body");
  // body.style.overflow = "hidden";

  // Закрытие модалки
  const exit = document.getElementById("exitt");
  function clearModal() {
    modalWindowElem.innerHTML = "";
  }
  //  body.style.overflow = "" };
  exit.addEventListener("click", clearModal);
}

// Пагинация

const btnPag = document.querySelectorAll(".buttons")
// console.log(btnPag)

btnPag.onclick =  () => {
 let btnPagValue = btnPag.innerHTML;
 console.log(btnPagValue);
};



// function loadTop100() {
//   request(
//     "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1"
//   ).then(showFilms);
// }