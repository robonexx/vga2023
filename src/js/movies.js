import { MOVIE_BASE_URL, MOVIE_API_KEY } from '../keys/keys.js';

let cinemaBtn = document.querySelector('.cinema_btn');
let topScoreBtn = document.querySelector('.top_score_btn');
let topLastyearBtn = document.querySelector('.top_lastyear_btn');
let bestScifiBtn = document.querySelector('.best_scifi_btn');
let errorMsg = document.querySelector('.error_msg');
//
const prevBtn = document.querySelector('.prev_btn');
const nextBtn = document.querySelector('.next_btn');
const paginationButtons = document.querySelector('.pagination_btns');
const itemsList = document.querySelector('#items_list');
/* let itemsArr = [...itemsList.querySelectorAll('.item_card')]; */
let itemsArr = [];

const itemsLimit = 10;
/* const pageCount = Math.ceil(itemsArr.length / itemsLimit); */
let pageCount;
let currentPage = 1;

// queries for different api endpoints

const BASE_URL = `${MOVIE_BASE_URL}discover/movie?sort_by=popularity.desc&api_key=${MOVIE_API_KEY}&page=1`;
const IMG_URL = 'https://image.tmdb.org/t/p/w1280';

const cinemaUrl = `${MOVIE_BASE_URL}/discover/movie?primary_release_date.gte=2022-12-31&primary_release_date.lte=2023-06-30&api_key=${MOVIE_API_KEY}&page=1`;

const topitemsUrl = `${MOVIE_BASE_URL}/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&vote_count.gte=1000&api_key=${MOVIE_API_KEY}&page=1`;

const topLastYearUrl = `${MOVIE_BASE_URL}/discover/movie?primary_release_year=2022&sort_by=vote_average.desc&vote_count.gte=2000&api_key=${MOVIE_API_KEY}&page=1`;

const bestSciFiUrl = `${MOVIE_BASE_URL}/discover/movie?with_genres=878&primary_release_date.gte=1960-01-01&primary_release_date.lte=2023-01-01&sort_by=vote_average.desc&vote_count.gte=1000&api_key=${MOVIE_API_KEY}&page=1`;

const SEARCH_API = `${MOVIE_BASE_URL}search/movie?&api_key=${MOVIE_API_KEY}&query=`;

let fetchURL = '';

// fetch api

const fetchMovies = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    itemsArr = data.results;
    if (!res.ok) {
      console.log('error getting data');
      return;
    } else {
      createItem(itemsArr);
      /* console.log(itemsArr); */
      getPaginationNumbers(itemsArr);
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

const fetchNew = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    itemsArr = data.results;
    if (!res.ok) {
      console.log('no data, something went wrong');
      return;
    } else {
      createItem(itemsArr);
      /* console.log(data);
      console.log(itemsArr); */
      getPaginationNumbers(itemsArr);
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

cinemaBtn.addEventListener('click', () => {
  fetchURL = cinemaUrl;
  fetchNew(fetchURL);
});
topScoreBtn.addEventListener('click', () => {
  fetchURL = topitemsUrl;
  fetchNew(fetchURL);
});
topLastyearBtn.addEventListener('click', () => {
  fetchURL = topLastYearUrl;
  fetchNew(fetchURL);
});
bestScifiBtn.addEventListener('click', () => {
  fetchURL = bestSciFiUrl;
  fetchNew(fetchURL);
});

// window load fetch

window.addEventListener('load', () => {
  fetchMovies();
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
  let data = [...document.querySelectorAll('.item_card')];
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

// creating the item cards from the fetch

const createItem = (item) => {
  let ul = itemsList;
  let html = '';

  item.forEach((item) => {
    const noImg = '../images/movie_frame.svg';
    let itemImg;
    if (
      item.backdrop_path === null ||
      item.backdrop_path === undefined ||
      item.backdrop_path === ''
    ) {
      itemImg = noImg;
    } else {
      itemImg = IMG_URL + item.backdrop_path;
    }

    let reviewImg;
    if (
      item.poster_path === null ||
      item.poster_path === undefined ||
      item.poster_path === ''
    ) {
      reviewImg = noImg;
    } else {
      reviewImg = IMG_URL + item.poster_path;
    }
    html += `
    <li class="item_card item_card_front movie">
                <img src="${itemImg}" img of ${item.title}>
                <h2>${item.title}</h2>
                <div class="item_info">
                    <div>
                        <span class="item_score">Rating: ${item.vote_average}</span>
                        <span class="item_score">Released: ${item.release_date}</span>
                    </div>
                </div>
                <div class="item_card_back item_review">
                <img class="item_bg_img" src="${reviewImg}" alt="movie img ${item.title}"></img>
                    <div class="overview">
                        <p>Overview: </p>
                        <p>${item.title}</p>
                        <p>${item.overview}</p>
                    </div>
                </div>
            </li>
    `;
    ul.innerHTML = html;
  });
};

const searchBtnActive = document.querySelector('.search_btn');

// helper functions
const toggleClass = (el, className) => el.classList.toggle(className);
const addClass = (el, className) => el.classList.add(className);
const removeClass = (el, className) => el.classList.remove(className);

searchBtnActive.addEventListener('click', (e) => {
  e.preventDefault();
  toggleClass(document.querySelector('form > .search_wrapper'), 'active');
  toggleClass(
    document.querySelector('form > .search_wrapper > label'),
    'active'
  );
  toggleClass(document.querySelector('#search'), 'active');
  toggleClass(
    document.querySelector('form > .search_wrapper > #submit'),
    'active'
  );

  if (searchBtnActive.classList.contains('fa-magnifying-glass')) {
    removeClass(searchBtnActive, 'fa-magnifying-glass');
  }
  /* wrapper.classList.toggle('active');
  label.classList.toggle('active'); */
  /* sInput.classList.toggle('active');
  subBtn.classList.toggle('active'); */
});

// for the search function get input from form
const form = document.getElementById('form');
form.addEventListener('submit', function (e) {
  e.preventDefault(); // so many ways of acutally doing this :D
  let search = document.querySelector('#search').value;
  console.log('this is the search value: ' + search);
  handleSearch(search);
  form.reset();

  removeClass(document.querySelector('form > .search_wrapper'), 'active');
  removeClass(
    document.querySelector('form > .search_wrapper > label'),
    'active'
  );
  removeClass(document.querySelector('#search'), 'active');
  removeClass(
    document.querySelector('form > .search_wrapper > #submit'),
    'active'
  );
  addClass(searchBtnActive, 'fa-magnifying-glass');
});

// function to fetch the search query
const handleSearch = async (search) => {
  if (search) {
    fetch(SEARCH_API + `${search}`)
      .then((res) => res.json())
      .then((data) => {
        /*  console.log(data.results); */
        createItem(data.results);
      });
  } else {
    return;
  }
};
