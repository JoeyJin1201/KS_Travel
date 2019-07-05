const allZone = [];
const list = document.querySelector('.content-list');
const zone = document.querySelector('#zone-selections');
const page = document.querySelector('.pageDeck');
const openBtnP = document.querySelector('.openBtnP');
const openBtnH = document.querySelector('.openBtnH');
const goTopBtn = document.querySelector('.goTopBtn');
const historyList = document.querySelector('.history-list');
const clearBtn = document.querySelector('.clear-history');
const time = new Date();

let allData = {};
let currentPage = 1;
let selectedZone = 'default';
let changePageClick = false;
let amount = 0;
let str = '';

function zoneSelectOptions() {
  let options = '<option value="default">- - 請選擇行政區 - -</option>';
  for (let i = 0; i < allData.length; i++) {
    if (allZone.indexOf(allData[i].Zone) === -1) {
      // .indexOf()可傳回該字串第一次於陣列中出現的位置，若回傳-1則表示未曾出現於陣列中
      allZone.push(allData[i].Zone);
      options += '<option value="' + allData[i].Zone + '" data-zone="' + allData[i].Zone + '">' + allData[i].Zone + '</option>';
    }
  }
  zone.innerHTML = options;
}

const xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.responseType = 'text';
xhr.send('null');
xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    let callBackData = JSON.parse(xhr.responseText);
    allData = callBackData.result.records;
    zoneSelectOptions();
  }
};

let data = JSON.parse(localStorage.getItem('search-history')) || [];
function localStoragePush() {
  const history = {
    searchZone: selectedZone,
    searchTime: time,
  };

  data.push(history);
  localStorage.setItem('search-history', JSON.stringify(data));
}

function scrollToContentStart() {
  const target = document.getElementById('content-start');
  if (window.scrollTo) {
    window.scrollTo({ 'behavior': 'smooth', 'top': target.offsetTop - 12 });
  }
}

function updateList(e) {
  if (changePageClick === false && e) {
    selectedZone = e.target.value;
  }
  if (changePageClick === false) {
    currentPage = 1;
  }
  localStoragePush();
  historyList.innerHTML = str;
  amount = parseInt(0);
  let listStr = '';
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].Zone === selectedZone) {
      amount += 1;
      if (amount <= currentPage * 4 && amount > (currentPage - 1) * 4) {
        listStr += '<li class="content-list-item"><h2 class="item-name">' + allData[i].Name + '</h2>';
        listStr += '<div class="item-img-wrap"><img src=' + allData[i].Picture1 + ' class="item-img"></div>';
        listStr += '<p class="item-zone">' + allData[i].Zone + '</p>';
        listStr += '<p class="item-open-time">' + allData[i].Opentime + '</p>';
        listStr += '<p class="item-add">' + allData[i].Add + '</p>';
        listStr += '<p class="item-tel">' + allData[i].Tel + '</p>';
        listStr += '<div class="item-ticket-info-wrap"><img src="img/icons_tag.png" class="tag">'
        if (allData[i].Ticketinfo === '') {
          listStr += '<p class="item-ticket-info">無票價資訊</p></div></li>';
        } else {
          listStr += '<p class="item-ticket-info">' + allData[i].Ticketinfo + '</p></div></li>';
        }
      }
    }
  }
  const listTitle = document.querySelector('.list-title');
  if (selectedZone === 'default') {
    listTitle.innerHTML = '目前尚未選擇區域';
  } else if (amount === 0) {
    listTitle.innerHTML = '該區目前沒有旅遊資訊';
  } else {
    listTitle.innerHTML = selectedZone;
  }
  list.innerHTML = listStr;
  const pageAmount = Math.ceil(amount / 4);
  let pageStr = '';
  if (pageAmount > 1) {
    pageStr += '<span data-page="p" class="prev">< prev</span>';
    for (let i = 1; i * 4 <= amount + 3; i++) {
      if (currentPage === i) {
        pageStr += '<span data-page="' + i + '" class="page current">' + i + '</span>';
      } else {
        pageStr += '<span data-page="' + i + '" class="page">' + i + '</span>';
      }
    }
    pageStr += '<span data-page="n" class="next">next ></span>';
    page.innerHTML = pageStr;
    if (currentPage === 1 && selectedZone !== 'default') {
      document.querySelector('.prev').classList.add('unclickable');
    } else if (currentPage === pageAmount) {
      document.querySelector('.next').classList.add('unclickable');
    }
  } else {
    pageStr = '';
    page.innerHTML = pageStr;
  }
  changePageClick = false;
  loadData();
  scrollToContentStart();
}

function historyPrint() {
  const getData = localStorage.getItem('search-history');
  if (getData && openBtnH.dataset.openlist === 'true') {
    str = '';
    const set = new Set();
    const result = JSON.parse(getData).filter(ls => !set.has(ls.searchZone) ? set.add(ls.searchZone) : false);
    // localStorage中重複地區的物件只取其一地區
    for (let i = 0; i < result.length; i++) {
      str += '<li class="history-list-item" data-zone="' + result[i].searchZone + '">' + result[i].searchZone + '</li>';
    }
    historyList.innerHTML = str;
  } else if (getData || openBtnH.dataset.openlist === 'false') {
    str = '';
    historyList.innerHTML = str;
  } else {
    str = '目前無搜尋紀錄！';
    historyList.innerHTML = str;
  }
  const historyZone = document.querySelectorAll('.history-list-item');
  Array.from(historyZone).forEach(eachHistoryZone => {
    eachHistoryZone.addEventListener('click', function () {
      selectedZone = this.dataset.zone;
      currentPage = 1;
      updateList();
    });
  });
}

function loadData(e) {
  if (e && e.target.nodeName === 'I') {
    openBtnH.dataset.openlist = (openBtnH.dataset.openlist === false) ? (openBtnH.dataset.openlist === 'true') : (openBtnH.dataset.openlist === 'false');
  }
  if (openBtnH.dataset.openlist === 'false') {
    openBtnH.setAttribute('style', 'transform: scaleY(-1);');
  } else if (openBtnH.dataset.openlist === 'true') {
    openBtnH.setAttribute('style', '');
  }
  historyPrint();
}

function openList(e) {
  if (e && e.target.nodeName === 'I') {
    if (openBtnP.dataset.openlist === 'true') {
      openBtnP.dataset.openlist = 'false';
      openBtnP.setAttribute('style', 'transform: scaleY(-1);');
      document.querySelector('.popular-list').classList.add('popular-list-closed');
    } else if (openBtnP.dataset.openlist === 'false') {
      openBtnP.dataset.openlist = 'true';
      openBtnP.setAttribute('style', '');
      document.querySelector('.popular-list').classList.remove('popular-list-closed');
    }
  }
}

function clearAll() {
  const clearConfirm = confirm('確定要把搜尋紀錄清光光？');
  if (clearConfirm === true) {
    localStorage.clear();
    data = [];
    openBtnH.dataset.openlist = true;
    loadData();
  }
}

loadData();

const popularZone = document.querySelectorAll('.popular-list-item');
Array.from(popularZone).forEach(eachPopularZone => {
  eachPopularZone.addEventListener('click', function () {
    selectedZone = this.dataset.zone;
    currentPage = 1;
    openBtnH.dataset.openlist = false;
    loadData();
    updateList();
  });
});

function changePage(e) {
  if (e.target.nodeName !== 'SPAN') {
    return;
  }

  if (isNaN(parseInt(e.toElement.dataset.page, 10)) && e.toElement.dataset.page === 'p') {
    currentPage -= 1;
  } else if (isNaN(parseInt(e.toElement.dataset.page, 10)) && e.toElement.dataset.page === 'n') {
    currentPage += 1;
  } else {
    currentPage = parseInt(e.toElement.dataset.page, 10);
  }

  changePageClick = true;
  updateList();
}

page.addEventListener('click', changePage, true);
zone.addEventListener('change', updateList, true);

function scrollToPageTop() {
  const target = document.getElementById('pageTop');
  if (window.scrollTo) {
    window.scrollTo({ 'behavior': 'smooth', 'top': target.offsetTop });
  }
}

function countScrollAmount() {
  if (window.pageYOffset >= 200) {
    goTopBtn.classList.add('show');
  } else {
    goTopBtn.classList.remove('show');
  }
}

window.addEventListener('scroll', countScrollAmount, false);

clearBtn.addEventListener('click', clearAll, false);
openBtnP.addEventListener('click', openList, false);
openBtnH.addEventListener('click', loadData, false);
goTopBtn.addEventListener('click', scrollToPageTop, false);
