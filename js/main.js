let xhr = new XMLHttpRequest();

let allZone = [];
let allData = {};

const list = document.querySelector('.content-list');
const zone = document.querySelector('#zone-selections');
const page = document.querySelector('.pageDeck');

let currentPage = 1;
let selectedZone = '';
let changePageClick = false;
let amount = 0;
let pageStr = '';

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

page.addEventListener('click', changePage, true);
zone.addEventListener('change', updateList, true);

function zoneSelectOptions() {
  let options = '<option value="default">- - 請選擇行政區 - -</option>';
  for (let i = 0; i < allData.length; i++) {
    if (allZone.indexOf(allData[i].Zone) === -1) {
      // .indexOf()可傳回該字串第一次於陣列中出現的位置，若回傳-1則表示未曾出現於陣列中
      allZone.push(allData[i].Zone);
      options += '<option value="' + allData[i].Zone + '">' + allData[i].Zone + '</option>';
    }
  }
  zone.innerHTML = options;
}

function updateList(e) {
  if (changePageClick === false) {
    selectedZone = e.target.value;
  }
  amount = parseInt(0);
  let listStr = '';
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].Zone === selectedZone) {
      amount = amount + 1;
      if (amount <= currentPage * 8 && amount > (currentPage - 1) * 8) {
        listStr += '<li class="content-list-item"><h2 class="item-name">' + allData[i].Name + '</h2>';
        listStr += '<div class="item-img-wrap"><img src=' + allData[i].Picture1 + ' class="item-img"></div>';
        listStr += '<p class="item-zone">' + allData[i].Zone + '</p>';
        listStr += '<p class="item-open-time">' + allData[i].Opentime + '</p>';
        listStr += '<p class="item-add">' + allData[i].Add + '</p>';
        listStr += '<p class="item-tel">' + allData[i].Tel + '</p>';
        listStr += '<img src="img/icons_tag.png" class="tag">'
        listStr += '<p class="item-ticket-info">' + allData[i].Ticketinfo + '</p></li>';
      }
    }
  }
  list.innerHTML = listStr;
  if (amount > 8) {
    pageStr = '<hr>';
    for (let i = 1; i * 8 <= amount + 7; i++) {
      if (currentPage === i) {
        pageStr += '<span data-page="' + i + '" class="page underLine">' + i + '</span>';
      } else {
        pageStr += '<span data-page="' + i + '" class="page">' + i + '</span>';
      }
    }
  } else {
    pageStr = '<hr>';
  }
  page.innerHTML = pageStr;
  changePageClick = false;
}

function changePage(e) {
  if (e.target.nodeName != 'SPAN') {
    return;
  }
  selectedZone = zone.value;
  currentPage = parseInt(e.toElement.dataset.page);
  changePageClick = true;
  updateList();
}