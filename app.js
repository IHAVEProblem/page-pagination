const prevButtonEl = document.getElementById('prev-button')
const nextButtonEl = document.getElementById('next-button')
const pageNumberContainerEl = document.getElementById('page-numbers')
const searchInputEl = document.getElementById('search-input')
const cardsPerPage = 2
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
  if (currentPage === 1) {
    prevButtonEl.classList.add('hidden')
  }

  let startPage = 1
  let endPage = totalPages
  const pageRange = 6
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

  for (let i = startPage; i <= endPage; i++) {
    const pageCircleEl = document.createElement('span')
    pageCircleEl.classList.add('page-circle')
    pageCircleEl.textContent = i
    if (i === currentPage) {
      pageCircleEl.classList.add('active')
    } else {
      pageCircleEl.addEventListener('click', () => {
        currentPage = i
        renderCards(cardsToRender, currentPage)
        prevButtonEl.classList.remove('hidden')
        nextButtonEl.classList.remove('hidden')
        if (currentPage === 1) {
          prevButtonEl.classList.add('hidden')
        }
        if (currentPage === totalPages) {
          nextButtonEl.classList.add('hidden')
        }
      })
    }

    pageNumberContainerEl.appendChild(pageCircleEl)
  }

  const cardElements = cardsToRender
    .slice(startIndex, endIndex)
    .map((card) => {
      return `
      <div class="card">
        <h2>${card.title}</h2>
        <p>${card.description}</p>
      </div>
    `
    })
    .join('')

  cardsContainerEl.innerHTML = cardElements
}

function handleSearchInput(event) {
  const query = event.target.value.toLowerCase()
  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
  currentPage = 1
  renderCards(filteredCards, currentPage)
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  if (totalPages === 1 || filteredCards.length === 0) {
    prevButtonEl.classList.add('hidden')
    nextButtonEl.classList.add('hidden')
  } else {
    prevButtonEl.classList.add('hidden')
    nextButtonEl.classList.remove('hidden')
  }
}

searchInputEl.addEventListener('keyup', handleSearchInput)
