let xhr = new XMLHttpRequest();

let allZone = [];
let allData = {};

const list = document.querySelector('.content-list');
const zone = document.querySelector('#zone-selections');
const page = document.querySelector('.pageDeck');

let currentPage = 1;
let selectedZone = 'default';
let changePageClick = false;
let amount = 0;
let pageStr = '';

let popularZone = document.querySelectorAll('.popular-list-item');

Array.from(popularZone).forEach(eachZone => {
  eachZone.addEventListener('click', function (event) {
    selectedZone = this.dataset.zone;
    console.log(this.dataset.zone);
    updateList();
    // if (!confirm(`sure u want to delete ${this.title}`)) {
    //   event.preventDefault();
    // }
  });
});

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
  if (changePageClick === false && selectedZone == 'default') {
    selectedZone = e.target.value;
  }
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
  if (amount == 0 || selectedZone == 'default') {
    listTitle.innerHTML = '尚未選擇區域';
    document.querySelector('.content').classList.add('defaultSize');
  } else {
    listTitle.innerHTML = selectedZone;
    document.querySelector('.content').classList.remove('defaultSize');
  }
  list.innerHTML = listStr;
  let pageAmount = Math.ceil(amount / 4);
  // console.log('總頁數:' + pageAmount);
  if (pageAmount > 1) {
    pageStr = '';
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
    if (currentPage == 1 && selectedZone != 'default') {
      document.querySelector('.prev').classList.add('unclickable');
    } else if (currentPage == pageAmount) {
      document.querySelector('.next').classList.add('unclickable');
    }
  } else {
    pageStr = '';
    page.innerHTML = pageStr;
  }
  changePageClick = false;
}

function changePage(e) {
  if (e.target.nodeName != 'SPAN') {
    return;
  }
  selectedZone = zone.value;

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