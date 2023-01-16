/* import './style.css'; */
const key = API_KEY;
const base = BASE_URL;
let mustplayBtn = document.querySelector('.mustplay_btn');
let topScoreBtn = document.querySelector('.top_score_btn');
let topLastyearBtn = document.querySelector('.top_lastyear_btn');
let upcomingBtn = document.querySelector('.upcoming_btn');
let errorMsg = document.querySelector('.error_msg');
//
const prevBtn = document.querySelector('.prev_btn');
const nextBtn = document.querySelector('.next_btn');
const paginationButtons = document.querySelector('.pagination_btns');
const gamesList = document.querySelector('#games_list');
/* let gamesArr = [...gamesList.querySelectorAll('.game_card')]; */
let gamesArr = [];

const itemsLimit = 10;
/* const pageCount = Math.ceil(gamesArr.length / itemsLimit); */
let pageCount;
let currentPage = 1;

// queries for different api endpoints

const baseUrl = `${base}?key=${key}&page=${1}&page_size=${20}`;

// found this mustplaygames api enpoint on stackoverflow set an error on purpose on this fetch, take away the /not/ and it works
const mustplayGamesUrl = `https://rawg.io/not/api/collections/must-play/games?key=${key}`;

const upcomingGamesUrl = `${base}?key=${key}&dates=2022-01-01,2023-12-01&ordering=-released&page_size=40`;

const topGamesUrl = `${base}?key=${key}&dates=2010-01-01,2023-01-01&ordering=-rating&page_size=20&metacritic=90,100`;

const topLastYearUrl = `${base}?key=${key}&dates=2022-01-01,2022-12-30&ordering=-rating&page_size=20&metacritic=80,100`;

const SEARCH_GAMES_URL = `${base}?key=${key}&search=`;

let fetchURL = '';

// fetch api

const fetchGAMES = async () => {
  try {
    const res = await fetch(baseUrl);
    const data = await res.json();
    gamesArr = data.results;
    if (!res.ok) {
      console.log('error getting data');
      return;
    } else {
      createItem(gamesArr);
      console.log(gamesArr);
      getPaginationNumbers(gamesArr);
    }
  } catch (error) {
    console.log(error + 'something went wrong');
    errorMsg.classList.add('show');
    errorMsg.textContent = 'OOPS! something went wrong, please try again';
    setTimeout(() => {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }, 3000);
  }
};

// get top games fetch
/* const mustplayGames = async () => {
  try {
    const res = await fetch(`${API_URL_TOP}?key=${API_KEY}`);
    const data = await res.json();
    gamesArr = data.results;
    if (!res.ok) {
      console.log(data.description);
      return;
    } else {
      createItem(gamesArr);
    }
  } catch (error) {
    console.log(error + 'something went wrong');
  }
};
 */

const fetchNew = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    gamesArr = data.results;
    if (!res.ok) {
      console.log(data.description);
      return;
    } else {
      createItem(gamesArr);
      console.log(data);
      console.log(gamesArr);
      getPaginationNumbers(gamesArr);
    }
  } catch (error) {
    console.log(error + 'something went wrong');
    errorMsg.classList.add('show');
    errorMsg.textContent = 'OOPS! something went wrong, please try again';
    setTimeout(() => {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }, 3000);
  }
};

// platforms
// pc 4
// playstation 5 id 187
// xbox series x/s id 186
// Nintendo Switch id 7

mustplayBtn.addEventListener('click', () => {
  fetchURL = mustplayGamesUrl;
  fetchNew(fetchURL);
});
topScoreBtn.addEventListener('click', () => {
  fetchURL = topGamesUrl;
  fetchNew(fetchURL);
});
topLastyearBtn.addEventListener('click', () => {
  fetchURL = topLastYearUrl;
  fetchNew(fetchURL);
});
upcomingBtn.addEventListener('click', () => {
  fetchURL = upcomingGamesUrl;
  fetchNew(fetchURL);
});

// window load fetch

window.addEventListener('load', () => {
  fetchGAMES();
  setCurrentPage(1);

  prevBtn.addEventListener('click', () => {
    setCurrentPage(currentPage - 1);
  });

  nextBtn.addEventListener('click', () => {
    setCurrentPage(currentPage + 1);
  });

  btnClick();
});

const removePagiBtns = () => {
  paginationButtons.innerHTML = '';
};

const createPaginationButton = async (idx) => {
  const paginationBtn = document.createElement('button');
  paginationBtn.classList.add('pagination_btn');
  paginationBtn.textContent = await idx;
  paginationBtn.setAttribute('page-index', idx);
  paginationBtn.setAttribute('aria-label', 'Page: ' + idx);
  /*  console.log(paginationBtn); */
  paginationButtons.appendChild(paginationBtn);

  btnClick();
};

function btnClick() {
  const btns = [...document.querySelectorAll('.pagination_btn')];
  btns.forEach((btn) => {
    console.log('page num clicked');
    const pageIndex = Number(btn.getAttribute('page-index'));
    if (pageIndex) {
      btn.addEventListener('click', () => {
        setCurrentPage(pageIndex);
      });
    }
  });
}

const getPaginationNumbers = async (data) => {
  removePagiBtns();
  await data;
  pageCount = Math.ceil(data.length / itemsLimit);
  for (let i = 1; i <= pageCount; i++) {
    createPaginationButton(i);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll('.pagination_btn').forEach((btn) => {
    btn.classList.remove('active');

    const pageIndex = Number(btn.getAttribute('page-index'));
    if (pageIndex == currentPage) {
      btn.classList.add('active');
    }
  });
};

// create function enable and disable buttons if on first or last page
// we will set the hanle page button status in the setCurrentPage to check status
const disableButton = (btn) => {
  btn.classList.add('disabled');
  btn.setAttribute('disabled', true);
};
const enableButton = (btn) => {
  btn.classList.remove('disabled');
  btn.removeAttribute('disabled');
};
const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevBtn);
  } else {
    enableButton(prevBtn);
  }
  if (pageCount === currentPage) {
    disableButton(nextBtn);
  } else {
    enableButton(nextBtn);
  }
};

const setCurrentPage = async (pageNum) => {
  let data = [...document.querySelectorAll('.game_card')];
  currentPage = pageNum;
  const prevCount = (pageNum - 1) * itemsLimit;
  const currCount = pageNum * itemsLimit;

  handleActivePageNumber();
  handlePageButtonsStatus();

  data.forEach((item, idx) => {
    item.classList.add('hidden');
    if (idx >= prevCount && idx < currCount) {
      item.classList.remove('hidden');
    }
  });
};

// creating the game cards from the fetch

// icons will only use 4 not getting mac, ios, android, etc

const ps = '<i class="fa-brands fa-playstation"></i>';
const xbox = '<i class="fa-brands fa-xbox"></i>';
const pc = '<i class="fa-solid fa-headset"></i>';
const nintendo = '<i class="fa-solid fa-n"></i>';

const createItem = (item) => {
  let ul = gamesList;
  let html = '';

  item.forEach((item) => {
    let platforms = '';

    item.parent_platforms.forEach((p) => {
      let name = p.platform.name;
      switch (name) {
        case 'PC':
          name = pc;
          break;
        case 'PlayStation':
          name = ps;
          break;
        case 'Xbox':
          name = xbox;
          break;
        case 'Nintendo':
          name = nintendo;
          break;
        default:
          return null;
      }

      platforms += `
                    <span>${name}</span>
                    `;
    });

    html += `
    <li class="game_card game_card_front">
                <img src="${item.background_image}" alt="">
                <h2>${item.name}</h2>
                <div class="game_info">
                    <div>
                        <span class="game_score">Rating: ${item.rating}</span>
                        <span class="game_score">Metacritic: ${item.metacritic}</span>
                        <p class="game_plattforms">${platforms}</p>
                    </div>
                </div>
                <div class="game_card_back game_review">
                    <p>review</p>
                    <p>${item.name}</p>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate ipsam fugiat facilis dolorum
                        at impedit quae laboriosam ullam laudantium optio.</p>
                </div>
            </li>
    `;
    ul.innerHTML = html;
  });
};

const searchBtnActive = document.querySelector('.fa-solid.fa-magnifying-glass');

searchBtnActive.addEventListener('click', (e) => {
  e.preventDefault();
  const wrapper = document.querySelector('form > .search_wrapper');
  const label = document.querySelector('form > .search_wrapper > label');
  const sInput = document.querySelector('#search');
  const subBtn = document.querySelector('form > .search_wrapper > #submit');

  wrapper.classList.toggle('active');
  label.classList.toggle('active');
  sInput.classList.toggle('active');
  subBtn.classList.toggle('active');
});

// for the search function get input from form
const form = document.getElementById('form');
form.addEventListener('submit', function (e) {
  e.preventDefault(); // so many ways of acutally doing this :D
  let search = document.querySelector('#search').value;
  console.log('this is the new search value inside submit function: ' + search);
  handleSearch(search);
  form.reset();
});

// function to fetch the search query
const handleSearch = async (search) => {
  fetch(SEARCH_GAMES_URL + `${search}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      createItem(data.results);
    });
};
