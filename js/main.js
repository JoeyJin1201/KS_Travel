let xhr = new XMLHttpRequest();

let allZone = [];
let allData = {};

const list = document.querySelector('.content-list');
const zone = document.querySelector('#zone-selections');
const page = document.querySelector('.pageDeck');
const openBtnP = document.querySelector('.openBtnP');
const openBtnH = document.querySelector('.openBtnH');

var historyList = document.querySelector('.history-list');
var data = JSON.parse(localStorage.getItem('search-history')) || [];
const clearBtn = document.querySelector('.clear-history');
var time = new Date();
clearBtn.addEventListener('click', clearAll, false);
openBtnH.addEventListener('click', loadData, false);

function lsPush() {

  var history = {
    searchZone: selectedZone,
    searchTime: time
  };

  data.push(history);
  localStorage.setItem('search-history', JSON.stringify(data));
}

function searchZone() {
  if (changePageClick === false && e) {
    selectedZone = e.target.value;
  }
}

function clearAll() {
  let clearConfirm = confirm('確定要把搜尋紀錄清光光？');
  if (clearConfirm === true) {
    localStorage.clear();
    console.log('localStorage.clear()');
    openBtnH.dataset.openlist = true;
    loadData();
  }
}

let currentPage = 1;
let selectedZone = 'default';
let changePageClick = false;
let amount = 0;
let print = false;

xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.responseType = 'text';
xhr.send('null');
xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const callBackData = JSON.parse(xhr.responseText);
    allData = callBackData.result.records;
    zoneSelectOptions();
  }
}

let popularZone = document.querySelectorAll('.popular-list-item');
Array.from(popularZone).forEach(eachPopularZone => {
  eachPopularZone.addEventListener('click', function () {
    selectedZone = this.dataset.zone;
    currentPage = 1;
    openBtnH.dataset.openlist = false;
    loadData();
    updateList();
  });
});
var str = ''

historyPrint();

let content = document.getElementById('content-start');

page.addEventListener('click', changePage, true);
zone.addEventListener('change', updateList, true);

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

loadData();

function loadData(e) {
  if (e && e.target.nodeName === "I") {
    openBtnH.dataset.openlist = (openBtnH.dataset.openlist == false) ? (openBtnH.dataset.openlist == 'true') : (openBtnH.dataset.openlist == 'false');
  }
  if (openBtnH.dataset.openlist == 'false') {
    openBtnH.setAttribute("style", "transform: scaleY(-1);");
  } else if (openBtnH.dataset.openlist == 'true') {
    openBtnH.setAttribute("style", "");
  }
  historyPrint();
}

function historyPrint() {
  var getData = localStorage.getItem('search-history');
  if (getData && openBtnH.dataset.openlist == 'true') {
    str = '';
    const set = new Set();
    const result = JSON.parse(getData).filter(ls => !set.has(ls.searchZone) ? set.add(ls.searchZone) : false);
    for (var i = 0; i < result.length; i++) {
      str += '<li class="history-list-item" data-zone="' + result[i].searchZone + '">' + result[i].searchZone + '</li>';
    }
    historyList.innerHTML = str;
  } else if (getData || openBtnH.dataset.openlist == 'false') {
    str = '';
    historyList.innerHTML = str;
  } else {
    str = '目前無搜尋紀錄！';
    historyList.innerHTML = str;
  }
  let historyZone = document.querySelectorAll('.history-list-item');
  Array.from(historyZone).forEach(eachHistoryZone => {
    eachHistoryZone.addEventListener('click', function () {
      console.log(this.dataset.zone);
      selectedZone = this.dataset.zone;
      currentPage = 1;
      updateList();
    });
  });
}

function updateList(e) {
  console.log(e);
  if (changePageClick === false && e) {
    selectedZone = e.target.value;
    // console.log('選單' + selectedZone);
    // } else {
    //   console.log('標籤' + this);
    //   selectedZone = this.dataset.zone;
    //   console.log('標籤' + selectedZone);
  }
  if (changePageClick === false) {
    currentPage = 1;
  }
  lsPush();
  historyList.innerHTML = str;
  let currentZone = document.querySelector('.list-title');
  // console.log(currentZone.value);
  // console.log(selectedZone.dataset.zone);
  amount = parseInt(0);
  let listStr = '';
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].Zone === selectedZone) {
      amount = amount + 1;
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
  let listTitle = document.querySelector('.list-title');
  if (selectedZone == 'default') {
    listTitle.innerHTML = '目前尚未選擇區域';
  } else if (amount == 0) {
    listTitle.innerHTML = '該區目前沒有旅遊資訊';
  } else {
    listTitle.innerHTML = selectedZone;
  }
  list.innerHTML = listStr;
  let pageAmount = Math.ceil(amount / 4);
  // console.log('總頁數:' + pageAmount);
  if (pageAmount > 1) {
    let pageStr = '';
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
    if (currentPage == 1 && selectedZone !== 'default') {
      document.querySelector('.prev').classList.add('unclickable');
    } else if (currentPage == pageAmount) {
      document.querySelector('.next').classList.add('unclickable');
    }
  } else {
    pageStr = '';
    page.innerHTML = pageStr;
  }
  changePageClick = false;
  loadData();
  scrollToContentStart();
  // if (currentZone !== selectedZone) {
  //   historyPrint();
  // }
}

function changePage(e) {
  if (e.target.nodeName !== 'SPAN') {
    return;
  }

  if (isNaN(parseInt(e.toElement.dataset.page)) && e.toElement.dataset.page == 'p') {
    currentPage -= 1;
  } else if (isNaN(parseInt(e.toElement.dataset.page)) && e.toElement.dataset.page == 'n') {
    currentPage += 1;
  } else {
    currentPage = parseInt(e.toElement.dataset.page);
  }

  changePageClick = true;
  updateList();
}

function scrollToContentStart() {
  let target = document.getElementById('content-start');
  if (window.scrollTo) {
    window.scrollTo({ 'behavior': 'smooth', 'top': target.offsetTop - 12 })
  }
}

function scrollToPageTop() {
  let target = document.getElementById('pageTop');
  if (window.scrollTo) {
    window.scrollTo({ 'behavior': 'smooth', 'top': target.offsetTop })
  }
}