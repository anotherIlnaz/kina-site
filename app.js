fetch(
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1",
  {
    method: "GET",
    headers: {
      "X-API-KEY": "2ce4a476-8679-4416-acfc-632199309f26",
      "Content-Type": "application/json",
    },
  }
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    return data;
  })
  .then(showFilms)
  .catch((err) => console.log(err));

/* <div class="film-card">
<div class="film-card-preview" style="background-image: url(https://kinopoiskapiunofficial.tech/images/posters/kp_small/301.jpg);">
<div class="film-card-raiting">9.9</div>
</div>
<div class="film-card-name">Матрыца</div>
<div class="film-card-genre">фантастика</div>
</div> */

function showFilms(data) {
  const filmsListElement = document.querySelector(".films-list");

  data.films.forEach((film) => {
    const filmsElement = document.createElement("div");
    filmsElement.classList.add("film-card");

    filmsElement.innerHTML = `
<div class="film-card-preview" style="background-image: url(${
      film.posterUrlPreview
    });">
<div class="film-card-raiting" style="border-color: ${getRaitingColor(
      Number(film.rating)
    )}">${film.rating}</div></div>
<div class="film-card-name">${film.nameRu}</div>
<div class="film-card-genre">${film.genres
      .map((x) => {
        return x.genre;
      })
      .join(", ")} </div>`;

    filmsListElement.appendChild(filmsElement);
  });
}

function getRaitingColor(raiting) {
  console.log(raiting);
  if (raiting > 7) {
    return "rgb(0, 254, 0)";
  } else if (7 > raiting && raiting > 6) {
    return "rgba(251, 251, 0, 0.919)";
  } else {
    return "rgba(251, 54, 0, 0.919)";
  }
}
