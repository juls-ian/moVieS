// PART OF REFACTORING

// creating am auto complete function
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input"/>
   
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"> </div>
      </div>
    </div>
  `;

  const inputField = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = debounce(async (event) => {
    // fetchData from script.js
    const movieItems = await fetchData(event.target.value);

    if (!movieItems.length) {
      return dropdown.classList.remove("is-active");
    }

    dropdown.classList.add("is-active");

    resultsWrapper.innerHTML = ""; // Clear previous results

    for (let movieItem of movieItems) {
      const options = document.createElement("a");
      options.classList.add("dropdown-item");
      //   this is for the dropdown render
      options.innerHTML = renderOption(movieItem);

      resultsWrapper.appendChild(options);

      options.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        inputField.value = inputValue(movieItem);
        onOptionSelect(movieItem);
      });
    }
  });

  inputField.addEventListener("input", onInput);

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
