import { BASE_URL, API_KEY } from './keys/keys.js';

let mustplayBtn = document.querySelector('.mustplay_btn');
let topScoreBtn = document.querySelector('.top_score_btn');
let topLastyearBtn = document.querySelector('.top_lastyear_btn');
let upcomingBtn = document.querySelector('.upcoming_btn');
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

const baseUrl = `${BASE_URL}?key=${API_KEY}&page=${1}&page_size=${20}`;

// found this mustplayitems api enpoint on stackoverflow set an error on purpose on this fetch, take away not/ and it works
const mustplayitemsUrl = `https://rawg.io/not/api/collections/must-play/items?key=${API_KEY}`;

const upcomingitemsUrl = `${BASE_URL}?key=${API_KEY}&dates=2022-01-01,2023-12-01&ordering=-released&page_size=40`;

const topitemsUrl = `${BASE_URL}?key=${API_KEY}&dates=2010-01-01,2023-01-01&ordering=-rating&page_size=20&metacritic=90,100`;

const topLastYearUrl = `${BASE_URL}?key=${API_KEY}&dates=2022-01-01,2022-12-30&ordering=-rating&page_size=20&metacritic=80,100`;

const SEARCH_itemS_URL = `${BASE_URL}?key=${API_KEY}&search=`;

let fetchURL = '';

// fetch api

const fetchGames = async () => {
  try {
    const res = await fetch(baseUrl);
    const data = await res.json();
    itemsArr = data.results;
    if (!res.ok) {
      console.log('error getting data');
      return;
    } else {
      createItem(itemsArr);
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
      console.log('couldent fetch data');
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
    errorMsg.textContent = 'Could not load data, server error';
    setTimeout(() => {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }, 3000);
  }
};

// function to fetch the search query
const handleSearch = async (search) => {
  /*  fetch(SEARCH_itemS_URL + `${search}`)
    .then((res) => res.json())
    .then((data) => {
      createItem(data.results);
    }); */
  try {
    const res = await fetch(SEARCH_itemS_URL + `${search}`);
    const data = await res.json();
    itemsArr = data.results;
    if (!res.ok) {
      console.log('couldent find the game you was looking for');
      return;
    } else {
      createItem(itemsArr);
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

mustplayBtn.addEventListener('click', () => {
  fetchURL = mustplayitemsUrl;
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
upcomingBtn.addEventListener('click', () => {
  fetchURL = upcomingitemsUrl;
  fetchNew(fetchURL);
});

// window load fetch

window.addEventListener('load', () => {
  fetchGames();
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

// icons will only use 4 not getting mac, ios, android, etc

const ps = '<i class="fa-brands fa-playstation"></i>';
const xbox = '<i class="fa-brands fa-xbox"></i>';
const pc = '<i class="fa-solid fa-headset"></i>';
const nintendo = '<i class="fa-solid fa-n"></i>';

const createItem = (item) => {
  let ul = itemsList;
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
    <li class="item_card item_card_front" data-id="${item.id}">
                <img src="${item.background_image}" class="game_img" alt="img of ${item.name}">
                <h2>${item.name}</h2>
                <div class="item_info">
                    <div>
                        <span class="item_score">Rating: ${item.rating}</span>
                        <span class="item_score">Metacritic: ${item.metacritic}</span>
                        <p class="item_platforms">${platforms}</p>
                    </div>
                </div>
                <div class="item_card_back item_review">
                    <p class="review_click">Click for more details</p>
                    <p>Review: </p>
                    <p>${item.name}</p>
                    <p>Reviews, trailers & other fun endpoints are behind a payed plan. SO You get - Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate ipsam fugiat facilis dolorum
                        at impedit quae laboriosam ullam laudantium optio.</p>
                </div>
            </li>
    `;
    ul.innerHTML = html;
  });

  detailsShow();
};

const searchBtnActive = document.querySelector('.search_btn');
const searchText = document.querySelector('.search_text');

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

  searchText.style.opacity = '0';

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
  searchText.style.opacity = '1';
});

function detailsShow() {
  const cards = [...document.querySelectorAll('.item_card')];
  const details = document.querySelector('.details_modal');
  cards.forEach((c) => {
    c.addEventListener('click', (e) => {
      console.log('card is clicked');
      details.classList.add('show');

      console.log(e.target);
      console.log(e.target.dataset.id);
      createDetails(itemsArr, e.target.dataset.id);
    });
  });
}

// almost same as the item create function
const createDetails = (array, dataId) => {
  console.log(array);
  array
    .filter((item) => item.id == dataId)
    .map((item) => {
      let details = document.querySelector('.details_modal');
      details.innerHTML = '';
      let html = '';
      let platforms = '';
      let imgcontainer;

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

      item.short_screenshots.forEach((th) => {
        imgcontainer += `
        <img className="thumbnails" src="${th.image}" alt="">
        `;
      });

      html += `
    <div class="details_container">
            <button class="go_back_btn">BACK</button>
            <img class="details_img" src="${item.background_image}" alt="img of ${item.name}">
            <h2 class="details_title">${item.name}</h2>
            <div class="details_info">
                <span class="details_score">Average Rating: ${item.rating}</span>
                <span class="details_score">Matacritic score: ${item.metacritic}</span>
                <p class="details_platforms">Plattforms: &nbsp;
                ${platforms}
                </p>
                <div class="details_release_date">Release date: 2022-10-12</div>
            </div>
            <div class="details_desc">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, excepturi. Sed inventore eaque
                    delectus quas commodi illum voluptas minus aliquid quia. Iste sunt animi aspernatur aut. Quibusdam
                    illum temporibus, molestiae atque animi, quasi neque delectus corrupti in nemo dignissimos qui
                    suscipit. Ullam atque, nostrum ut libero fugit harum soluta. Illo odit nisi earum autem aspernatur
                    similique, tempore ad esse aut?</p>
            </div>
            <div class="details_thumbnails">${imgcontainer}</div>
        </div>
    `;
      details.innerHTML = html;

      let back = document.querySelector('.go_back_btn');
      back.addEventListener('click', () => {
        details.classList.remove('show');
      });
    });
};
