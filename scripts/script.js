// REFACTORED

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <img src="${imgSRC}"/>
        ${movie.Title} (${movie.Year})`;
  },
  inputValue(inputMovie) {
    return inputMovie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "7dc24b3c",
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  }
};

// AUTOCOMPLETE DIRECTORY (object)
// calling auto complete from autocomplete.js then adding configs

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(selectedMovie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      selectedMovie,
      document.querySelector("#left-summary"),
      "left"
    );
  }
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(selectedMovie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      selectedMovie,
      document.querySelector("#right-summary"),
      "right"
    );
  }
});

// COMPARISON
let leftMovie;
let rightMovie;

// ON MOVIE SELECT FUNCTION
const onMovieSelect = async (movieSummary, summarySide, side) => {
  const response2 = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7dc24b3c",
      i: movieSummary.imdbID
    }
  });

  summarySide.innerHTML = movieTemplate(response2.data);

  if (side === "left") {
    leftMovie = response2.data;
  } else {
    rightMovie = response2.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// GENERATING MOVIE TEMPLATE FUNCTION
const movieTemplate = (movieDetail) => {
  const boxOffice = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <p>${movieDetail.Year}</p>
          <h4>${movieDetail.Genre}</h4>
          <p> ${movieDetail.Plot}</p>
           
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>

    <article data-value=${boxOffice} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    </article>

    `;
};

// NOT WORKING
/*const fetchData = async searchTerm => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7dc24b3c",
      //   by search query
      s: searchTerm
    }
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class="input"/>
 
  <div class="dropdown">
    <div class="dropdown-menu>
      <div class="dropdown-content results"> </div>
    </div>
  </div>
`;

const inputField = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// this will be received in debounced as "func"
const onInput = debounce(async event => {
  const movies = await fetchData(event.target.value);

  dropdown.classList.add("is-active");

  for (let movie of movies) {
    const options = document.createElement("a");

    options.classList.add("dropdown-item");
    options.innerHTML = `
    <img src="${movie.Poster}"/>
    ${movie.Title}`;

    resultsWrapper.appendChild(options);
  }
});

inputField.addEventListener("input", onInput);
*/

/*
// VERSION 2
const inputField = document.querySelector("input");

const debounce = (func, delay = 1000) => {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// this will be received in debounced as "func"
const onInput = (event) => {
  fetchData(event.target.value);
};

inputField.addEventListener("input", debounce(onInput, 500));
*/

/*
let timeoutId;
const onInput = (event) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    fetchData(event.target.value);
  }, 1000);
};
*/
