let allTours = [];
let filteredTours = [];

// Load tours and places on page load
document.addEventListener('DOMContentLoaded', function () {
    // existing calls
    loadAllTours();
    loadMustVisitPlaces('Malaysia');
    loadCountries();

    // ✅ Auto-fill if query params exist
    const params = new URLSearchParams(window.location.search);
    const country = params.get('country');
    const region = params.get('region');
    const date = params.get('date');

    if (country && date) {
        // Fill form fields
        setTimeout(() => {
            for (let i = 0; i < countrySelect.options.length; i++) {
                const option = countrySelect.options[i];
                const optionValue = option.value?.toLowerCase();
                const optionName = option.getAttribute('data-name')?.toLowerCase();

                if (optionValue === country.toLowerCase() || optionName === country.toLowerCase()) {
                countrySelect.selectedIndex = i;
                break;
                }
            }

            if (region) {
                regionSelect.value = region;
            }

            if (date) {
                document.getElementById('date').value = date;
            }

            performSearch();
            }, 500);
    }
});


// Search form submission
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    performSearch();
});

// Sort functionality
document.getElementById('sortBy').addEventListener('change', function () {
    sortTours(this.value);
});

// Country and region dropdown
const countrySelect = document.getElementById('country');
const regionSelect = document.getElementById('region');

countrySelect.addEventListener('change', function () {
    const selectedCountryCode = this.value;
    if (selectedCountryCode) {
        loadRegions(selectedCountryCode);
    } else {
        regionSelect.innerHTML = '<option value="">Select a Region</option>';
        regionSelect.disabled = true;
    }
});


function searchCountry(country) {
  const dateField = document.getElementById(`date-${country}`);
  const date = dateField ? dateField.value : '';

  if (!date) {
    alert('Please select a date before searching.');
    return;
  }

  // redirect to search page
  window.location.href = `/search.html?country=${encodeURIComponent(country)}&date=${encodeURIComponent(date)}`;
}
const dummyCountries = [
  { isoCode: "MY", name: "Malaysia", flag: "🇲🇾" },
  { isoCode: "TH", name: "Thailand", flag: "🇹🇭" },
  { isoCode: "ID", name: "Indonesia", flag: "🇮🇩" }
];

const dummyRegions = {
  MY: [
    { name: "Kuala Lumpur" },
    { name: "Penang" },
    { name: "Sabah" }
  ],
  TH: [
    { name: "Bangkok" },
    { name: "Phuket" }
  ],
  ID: [
    { name: "Bali" },
    { name: "Jakarta" }
  ]
};

const dummyTours = [
  {
    id: 1,
    partner_logo: "https://malaysiatravelgate.com.my/wp-content/uploads/2020/04/MTG-BYR.svg",
    partner_name: "Amazing Travel",
    duration: "3 days",
    price: 1200,
    discount_amount: 200,
    start_date: "2025-09-15",
    notice_days: 0,
    tour_name: "Discover Kuala Lumpur",
    package_include: JSON.stringify(["Hotel Stay", "Breakfast", "City Tour"]),
    package_exclude: JSON.stringify(["Flight Tickets", "Visa"]),
    deposit_payment: "RM500",
    max_people: 20,
  },
  {
    id: 2,
    partner_logo: "https://malaysiatravelgate.com.my/wp-content/uploads/2020/04/MTG-BYR.svg",
    partner_name: "Holiday Experts",
    duration: "5 days",
    price: 2000,
    discount_amount: 0,
    start_date: "2025-09-25",
    notice_days: 5,
    tour_name: "Penang Heritage Tour",
    package_include: JSON.stringify(["Hotel Stay", "Breakfast", "Guided Tour"]),
    package_exclude: JSON.stringify(["Insurance", "Personal Expenses"]),
    deposit_payment: "No Deposit is Required",
    max_people: 15,
  }
];

const dummyPlaces = [
  {
    place_name: "Petronas Twin Towers",
    description: "Iconic skyscrapers in Kuala Lumpur.",
    photo_url: "https://malaysiatravelgate.com.my/wp-content/uploads/2020/04/MTG-BYR.svg"
  },
  {
    place_name: "Penang Street Art",
    description: "Famous murals across George Town, Penang.",
    photo_url: "https://malaysiatravelgate.com.my/wp-content/uploads/2020/04/MTG-BYR.svg"
  }
];
// Load countries
// Load countries
async function loadCountries() {
  try {
    // Replace API fetch with dummy
    const countries = dummyCountries;

    countrySelect.innerHTML = '<option value="">Select a Country</option>';
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.isoCode;
      option.textContent = `${country.flag} ${country.name}`;
      option.setAttribute('data-name', country.name);
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading countries:', error);
    countrySelect.innerHTML = '<option value="">Error loading countries</option>';
  }
}

// Load regions for selected country
async function loadRegions(countryCode) {
  try {
    regionSelect.innerHTML = '<option value="">Loading regions...</option>';
    regionSelect.disabled = true;

    const regions = dummyRegions[countryCode] || [];

    if (regions.length === 0) {
      regionSelect.innerHTML = '<option value="">No regions available</option>';
      regionSelect.disabled = true;
      return;
    }

    regionSelect.innerHTML = '<option value="">Select a Region</option>';
    regions.forEach(region => {
      const option = document.createElement('option');
      option.value = region.name;
      option.textContent = region.name;
      regionSelect.appendChild(option);
    });

    regionSelect.disabled = false;
  } catch (error) {
    console.error('Error loading regions:', error);
    regionSelect.innerHTML = '<option value="">Error loading regions</option>';
    regionSelect.disabled = true;
  }
}

// Load all tours
async function loadAllTours() {
  try {
    // Use dummy tours
    allTours = dummyTours;
    displayTours(allTours);
    updateResultsHeader(allTours.length, 'All Available Tours');
  } catch (error) {
    console.error('Error loading tours:', error);
    showError('Failed to load tours. Please try again later.');
  }
}


// Search handler
async function performSearch() {
  const formData = new FormData(document.getElementById('searchForm'));
  const countryCode = formData.get('country');
  const region = formData.get('region');
  const date = formData.get('date');

  const selectedCountryOption = countrySelect.options[countrySelect.selectedIndex];
  const countryName = selectedCountryOption ? selectedCountryOption.getAttribute('data-name') : '';

  if (!countryName || !date) {
    showError('Please select country and date.');
    return;
  }

  showLoading();

  try {
    // Filter dummy tours instead of API fetch
    filteredTours = dummyTours.filter(tour => {
      return (
        (region ? tour.tour_name.toLowerCase().includes(region.toLowerCase()) : true) &&
        new Date(tour.start_date) >= new Date(date)
      );
    });

    displayTours(filteredTours);
    updateResultsHeader(filteredTours.length, `Search Results for ${countryName} ${region ? "> " + region : ""}`);

    document.getElementById('toursGrid').style.display = 'grid';
    document.getElementById('loadingSpinner').style.display = 'none';

  } catch (error) {
    console.error('Search error:', error);
    showError('Failed to perform search. Please try again.');
  }
}


function renderTourCard(tour, isNotice = false) {
    const includedItems = parseJsonArray(tour.package_include);
    const excludedItems = parseJsonArray(tour.package_exclude);

    const originalPrice = tour.price || 0;
    const discountAmount = tour.discount_amount || 0;
    const currentPrice = originalPrice - discountAmount;

    return `
    <div class="tour-card-horizontal ${isNotice ? 'notice-tour' : ''}">
      <div class="tour-card-inner">

        <div class="tour-left">
          <img src="${tour.partner_logo}" alt="${tour.partner_name}" class="partner-logo" onerror="this.style.display='none'">

          <div class="tour-left-info">
            <h3 class="partner-name">${tour.partner_name}</h3>
            <div class="duration">🕓 ${tour.duration || '-'}</div>

            <div class="price-info">
              ${discountAmount > 0 ? `<div class="original-price">RM${originalPrice.toFixed(2)}</div>` : ''}
              <div class="current-price">RM${currentPrice.toFixed(2)}</div>
              ${discountAmount > 0 ? `<div class="savings">Save RM${discountAmount.toFixed(2)}</div>` : ''}
            </div>

            <button class="view-details-btn" onclick="viewTourDetails(${tour.id})">View details</button>
          </div>
        </div>

        <div class="tour-right">
          <div class="departure-date">
            ${tour.start_date 
              ? `Departure Date: ${formatDate(tour.start_date)}` 
              : `📅 Available after ${tour.notice_days} days`}
          </div>
          <h3 class="tour-title">${tour.tour_name}</h3>

          <div class="package-summary-horizontal">
            <div class="package-section">
              <div class="section-title green">Package Include</div>
              <ul>${includedItems.slice(0, 3).map(item => `<li>✅ ${item}</li>`).join('')}</ul>
            </div>
            <div class="package-section">
              <div class="section-title red">Package Exclude</div>
              <ul>${excludedItems.slice(0, 3).map(item => `<li>❌ ${item}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>

      <div class="meta-info-bottom">
        <div class="no-hidden-fees">💲 No hidden fees</div>
        <div class="no-deposit">💲 Deposit: ${tour.deposit_payment || 'No Deposit is Required.'}</div>
        <div class="max-people">🧍 MAX ${tour.max_people || 'Undefined'}</div>
      </div>
    </div>
  `;
}

// Display tours
function displayTours(tourList) {
    const container = document.getElementById('toursGrid');
    if (!container) return;

    container.innerHTML = tourList.map(tour => {
        const includedItems = parseJsonArray(tour.package_include);
        const excludedItems = parseJsonArray(tour.package_exclude);

        const originalPrice = tour.price || 0;
        const discountAmount = tour.discount_amount || 0;
        const currentPrice = originalPrice - discountAmount;

        return `
        <div class="tour-card-horizontal">
          <div class="tour-card-inner">

            <div class="tour-left">
              <img src="${tour.partner_logo}" alt="${tour.partner_name}" class="partner-logo" onerror="this.style.display='none'">

              <div class="tour-left-info">
                <h3 class="partner-name">${tour.partner_name}</h3>
                <div class="duration">🕓 ${tour.duration || '-'}</div>

                <div class="price-info">
                  ${discountAmount > 0 ? `<div class="original-price">RM${originalPrice.toFixed(2)}</div>` : ''}
                  <div class="current-price">RM${currentPrice.toFixed(2)}</div>
                  ${discountAmount > 0 ? `<div class="savings">Save RM${discountAmount.toFixed(2)}</div>` : ''}
                </div>

                <button class="view-details-btn" onclick="viewTourDetails(${tour.id})">View details</button>
              </div>
            </div>

            <div class="tour-right">
              <div class="departure-date">Departure Date: ${formatDate(tour.start_date)}</div>
              <h3 class="tour-title">${tour.tour_name}</h3>

              <div class="package-summary-horizontal">
                <div class="package-section">
                  <div class="section-title green">Package Include</div>
                  <ul>${includedItems.slice(0, 3).map(item => `<li>✅ ${item}</li>`).join('')}</ul>
                </div>
                <div class="package-section">
                  <div class="section-title red">Package Exclude</div>
                  <ul>${excludedItems.slice(0, 3).map(item => `<li>❌ ${item}</li>`).join('')}</ul>
                </div>
              </div>
            </div>
          </div>

          <div class="meta-info-bottom">
            <div class="no-hidden-fees">💲 No hidden fees</div>
            <div class="no-deposit">💲 Deposit: ${tour.deposit_payment || 'No Deposit is Required.'}</div>
            <div class="max-people">🧍 MAX ${tour.max_people || 'Undefined'}</div>
          </div>
        </div>
      `;
    }).join('');
}

// Sorting logic
function sortTours(criteria) {
    const toursToSort = filteredTours.length > 0 ? filteredTours : allTours;
    let sortedTours = [...toursToSort];

    switch (criteria) {
        case 'price_low':
            sortedTours.sort((a, b) => (a.price - (a.discount_amount || 0)) - (b.price - (b.discount_amount || 0)));
            break;
        case 'price_high':
            sortedTours.sort((a, b) => (b.price - (b.discount_amount || 0)) - (a.price - (a.discount_amount || 0)));
            break;
        case 'date_earliest':
            sortedTours.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            break;
        case 'date_latest':
            sortedTours.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            break;
        case 'duration_short':
            sortedTours.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
            break;
        case 'duration_long':
            sortedTours.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
            break;
    }

    displayTours(sortedTours);
}

function parseDuration(duration) {
    if (!duration) return 0;
    const days = duration.match(/(\d+)\s*days?/i);
    return days ? parseInt(days[1]) : 0;
}

function parseJsonArray(jsonString) {
    try {
        return JSON.parse(jsonString) || [];
    } catch (e) {
        return [];
    }
}

function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function updateResultsHeader(count, title) {
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsCount').textContent = `${count} tour${count !== 1 ? 's' : ''} found`;
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('toursGrid').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
}

function showError(message) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('toursGrid').innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e53e3e;">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

async function loadMustVisitPlaces(country, region) {
  const list = document.getElementById('mustVisitList');
  if (!list) return;

  list.innerHTML = `<li>Loading...</li>`;

  try {
    const places = dummyPlaces;

    if (!places || places.length === 0) {
      list.innerHTML = `<li>No must-visit places found.</li>`;
      return;
    }

    list.innerHTML = places.map((place, index) => `
      <li class="must-visit-item">
        <div class="place-name" style="cursor:pointer;"><strong>${place.place_name}</strong></div>
        <div class="must-visit-info">
          <img src="${place.photo_url}" alt="${place.place_name}" class="must-visit-img" />
          <p>${place.description}</p>
        </div>
      </li>
    `).join('');

    enableCollapsibles();
  } catch (error) {
    console.error('Error loading must visit:', error);
    list.innerHTML = `<li style="color:red;">Failed to load data</li>`;
  }
}

function enableCollapsibles() {
    const items = document.querySelectorAll('.must-visit-item');

    items.forEach(item => {
        const name = item.querySelector('.place-name');
        const info = item.querySelector('.must-visit-info');

        if (name && info) {
            info.style.display = 'none';
            name.addEventListener('click', () => {
                const isVisible = info.style.display === 'block';
                info.style.display = isVisible ? 'none' : 'block';
            });
        }
    });
}

function viewTourDetails(tourId) {
    window.location.href = `tour_details_page.html?id=${tourId}`;
}
