const prevButtonEl = document.getElementById('prev-button')
const nextButtonEl = document.getElementById('next-button')
const pageNumberContainerEl = document.getElementById('page-numbers')
const searchInputEl = document.getElementById('search-input')
// set how many cards do you want to be displayed per page
const cardsPerPage = 3
// sets initial page to load
let currentPage = 1

// render cards on load
renderCards(cards, currentPage)

// handle prev click to move back 1 page
function handlePrevClick() {
  // get the filtered cards based on the search input
  const filteredCards = filterCards(cards)
  // check if we're not on the first page
  if (currentPage > 1) {
    currentPage--

    renderCards(filteredCards, currentPage)
    // hide the prev button if we're on the first page, if yes, hide button
    if (currentPage === 1) {
      prevButtonEl.classList.add('hidden')
    }
    nextButtonEl.classList.remove('hidden')
  }
}

// handle prev click to move forvard 1 page
function handleNextClick() {
  const filteredCards = filterCards(cards)
  // get the total number of pages based on the filtered cards
  const totalPages = Math.ceil(filterCards(cards).length / cardsPerPage)
  // check if we're not on the last page, if yes, hide button
  if (currentPage < totalPages) {
    currentPage++

    renderCards(filteredCards, currentPage)
    if (currentPage === totalPages) {
      nextButtonEl.classList.add('hidden')
    }
    prevButtonEl.classList.remove('hidden')
  }
}

// filter the cards based on the search input
function filterCards(cardsToFilter) {
  const query = searchInputEl.value.toLowerCase()
  return cardsToFilter.filter(
    (card) =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
}

prevButtonEl.addEventListener('click', handlePrevClick)
nextButtonEl.addEventListener('click', handleNextClick)

function renderCards(cardsToRender, page) {
  const cardsContainerEl = document.getElementById('cards-container')
  const startIndex = (page - 1) * cardsPerPage
  const endIndex = startIndex + cardsPerPage
  const totalPages = Math.ceil(cardsToRender.length / cardsPerPage)

  cardsContainerEl.innerHTML = ''
  pageNumberContainerEl.innerHTML = ''
  // hide prev btn on load
  if (currentPage === 1) {
    prevButtonEl.classList.add('hidden')
  }

  // keeps track of total dots
  let startPage = 1
  let endPage = totalPages
  // sets how many dots allowed to be displayed on screen at time, the total will be pageRange + 2 intul if figure out how to make it just pageRange, and append (...) instead of second index i.e. (1 ... 3,4,5 ... 20) and also show last and first index.
  const pageRange = 3
  if (totalPages > pageRange) {
    if (currentPage <= Math.floor(pageRange / 2)) {
      endPage = pageRange
    } else if (currentPage >= totalPages - Math.floor(pageRange / 2) - 1) {
      startPage = totalPages - pageRange + 1
    } else {
      startPage = currentPage - Math.floor(pageRange / 2)
      endPage = currentPage + Math.ceil(pageRange / 2) - 1
    }
  }

  //create first page index if not visible and add dots
  if (startPage > 1) {
    const firstPageIndexEl = document.createElement('span')
    firstPageIndexEl.classList.add('page-circle')
    firstPageIndexEl.textContent = 1
    firstPageIndexEl.addEventListener('click', () => {
      currentPage = 1
      renderCards(cardsToRender, currentPage)
      prevButtonEl.classList.add('hidden')
      nextButtonEl.classList.remove('hidden')
    })
    pageNumberContainerEl.appendChild(firstPageIndexEl)

    // Add dots after second page index
    if (startPage > 2) {
      const dotsEl = document.createElement('span')
      dotsEl.classList.add('page-dots')
      dotsEl.textContent = '...'
      pageNumberContainerEl.appendChild(dotsEl)
    }
  }

  // go through total dots, and append dots with their numbers to the pageNumberContainerEl
  for (let i = startPage; i <= endPage; i++) {
    const pageCircleEl = document.createElement('span')
    pageCircleEl.classList.add('page-circle')
    pageCircleEl.textContent = i
    // keep track of active dot i.e. the page you currently are
    if (i === currentPage) {
      pageCircleEl.classList.add('active')
    } else {
      // set listener on dot clicks to move to their related page
      pageCircleEl.addEventListener('click', () => {
        currentPage = i
        renderCards(cardsToRender, currentPage)
        prevButtonEl.classList.remove('hidden')
        nextButtonEl.classList.remove('hidden')
        // hide the prev btn if its firs page
        if (currentPage === 1) {
          prevButtonEl.classList.add('hidden')
        }
        // hide the next btn if its last page
        if (currentPage === totalPages) {
          nextButtonEl.classList.add('hidden')
        }
      })
    }
    // append all dots to the container
    pageNumberContainerEl.appendChild(pageCircleEl)
  }

  // create last page index if its not visible
  if (endPage < totalPages) {
    // Add dots before last page index if there are more than 3 dots in front of it
    if (endPage < totalPages - 1) {
      const dotsEl = document.createElement('span')
      dotsEl.classList.add('page-dots')
      dotsEl.textContent = '...'
      pageNumberContainerEl.appendChild(dotsEl)
    }
    const lastPageEl = document.createElement('span')
    lastPageEl.classList.add('page-circle')
    lastPageEl.textContent = totalPages
    lastPageEl.addEventListener('click', () => {
      currentPage = totalPages
      renderCards(cardsToRender, currentPage)
      prevButtonEl.classList.remove('hidden')
      nextButtonEl.classList.add('hidden')
    })
    pageNumberContainerEl.appendChild(lastPageEl)
  }

  // append all the cards from cardList

  // if no cards found, show this empty state
  if (cardsToRender.length === 0) {
    cardsContainerEl.innerHTML =
      '<p class="empty-state">No cards found ＞︿＜</p>'
  } else {
    const cardElements = cardsToRender
      .slice(startIndex, endIndex)
      .map((card) => {
        return `
      <div class="card">
         <img src="${card.img}" class="card-img" alt="${card.img}">
        <h2>${card.title}</h2>
        <p>${card.description}</p>
      </div>
    `
      })
      .join('')

    cardsContainerEl.innerHTML = cardElements
  }
}

// search function that gets the value from the input, and fillers the cardsList, if the input value matches the card value, display these cards

function handleSearchInput(event) {
  const query = event.target.value.toLowerCase()
  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
  // reset page index, so the filtered cards start at first page istead of whatever index was before
  currentPage = 1
  renderCards(filteredCards, currentPage)
  // hide or show next/prev btns after search, if after search you have only 1 page, hide both btns
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  if (totalPages === 1 || filteredCards.length === 0) {
    prevButtonEl.classList.add('hidden')
    nextButtonEl.classList.add('hidden')
  } else {
    prevButtonEl.classList.add('hidden')
    nextButtonEl.classList.remove('hidden')
  }
}

// add search func to input on keyup
searchInputEl.addEventListener('keyup', handleSearchInput)
