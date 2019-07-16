// Create sortable for each semester
for (i = 1; i < 11; i++) {
  let el = document.getElementById('simpleList' + i);
  Sortable.create(el, {
    group: {
      name: 'shared',
      put: function(to) {
        return to.el.children.length < 7;
      }
      /*
      pull: function(to, from) {
        return from.el.children.length > 1;
      }
      */
    },
    animation: 150,
    ghostClass: 'ghost',
    onAdd: function(evt) {
      handleAddEvent(evt);
    },
    onRemove: function(evt) {
      if (evt.to.id === 'buffer') {
        evt.item.classList.remove('error');
      }
    }
  });
}
// Create sortable for buffer
Sortable.create(buffer, {
  group: 'shared',
  animation: 150,
  ghostClass: 'ghost',
  onRemove: function(evt) {
    let moduleCode = evt.item.innerText.split(/\s/)[0];
    sessionStorage.setItem(moduleCode, evt.to.id.substring(10));
  },
  onAdd: function(evt) {
    handleAddToBufferEvent(evt);
  }
});

function handleAddEvent(evt) {
  let id = evt.to.id.substring(10);
  let moduleCode = evt.item.innerText.split(/\s/)[0];
  sessionStorage.setItem(moduleCode, id);
  activeModules.push(moduleCode);
  if (!prereqV2(moduleCode)) {
    evt.item.classList.add('error');
  }
  recheckAll();
  console.log(activeModules);
}

function handleAddToBufferEvent(evt) {
  let moduleCode = evt.item.innerText.split(/\s/)[0];
  sessionStorage.setItem(moduleCode, 'b');
  removeModule(moduleCode);
  console.log(activeModules);
  evt.item.classList.remove('error');
  recheckAll();
}

// Recheck prereq
function recheckAll() {
  console.log('recheckAll');
  activeModules.forEach(activeMod => {
    if (!prereqV2(activeMod)) {
      document.querySelector(`#${activeMod}`).classList.add('error');
    } else {
      document.querySelector(`#${activeMod}`).classList.remove('error');
    }
  });
}

function removeModule(modStr) {
  activeModules.splice(activeModules.indexOf(modStr), 1);
  sessionStorage.removeItem(modStr);
}

// Helper function
function prereqV2(module) {
  let contains = false;
  if (!moduleObjs.get(module).prereqTree) {
    contains = true;
  } else {
    activeModules.forEach(amod => {
      if (moduleObjs.get(amod).fulfillRequirements) {
        let fulfillRequirements = moduleObjs.get(amod).fulfillRequirements;
        if (fulfillRequirements.includes(module)) {
          contains = true;
        }
      }
    });
  }
  return contains;
}

async function getModData(module) {
  const url = `https://api.nusmods.com/v2/2018-2019/modules/${module}.json`;
  const cache = await caches.open('modcache');
  let res = await cache.match(url);
  if (!res) {
    await cache.add(url);
    res = await cache.match(url);
    let data = await res.json();
    return data;
  } else {
    let data = await res.json();
    return data;
  }
}

const colors = ['blue', 'teal', 'yellow', 'orange', 'red'];
const moduleObjs = new Map();
const activeModules = [];

// Autocomplete module search
async function getSearchData() {
  const moduleListURL = 'https://api.nusmods.com/v2/2018-2019/moduleList.json';
  const cache = await caches.open('searchcache');
  let res = await cache.match(moduleListURL);
  if (!res) {
    await cache.add(moduleListURL);
    res = await cache.match(moduleListURL);
    let data = await res.json();
    return data;
  } else {
    let data = await res.json();
    return data;
  }
}

getSearchData().then(ml => {
  var input = document.getElementById('module-code');
  autocomplete({
    input: input,
    fetch: function(text, update) {
      text = text.toLowerCase();
      // you can also use AJAX requests instead of preloaded data
      var suggestions = ml.filter(n =>
        n.moduleCode.toLowerCase().includes(text)
      );
      update(suggestions);
    },
    render: function(item, value) {
      const itemElement = document.createElement('div');
      var regex = new RegExp(value, 'gi');
      var inner = item.moduleCode.replace(regex, function(match) {
        return '<strong>' + match + '</strong>';
      });
      itemElement.innerHTML = inner;
      itemElement.innerHTML += ` ${item.title}`;
      return itemElement;
    },
    onSelect: function(item) {
      input.value = item.moduleCode;
    },
    minLength: 1
  });
});

async function persist() {
  for (let i = 0; i < sessionStorage.length; i++) {
    let moduleCode = sessionStorage.key(i);
    let position = sessionStorage.getItem(sessionStorage.key(i));
    getModData(moduleCode)
      .then(data => {
        moduleObjs.set(data.moduleCode, data);
        return data;
      })
      .then(data => {
        let color = getRandomItem(colors);
        let card = returnCard(data, color);
        if (position === 'b') {
          addToBuffer(card);
        } else {
          activeModules.push(data.moduleCode);
          addToPosition(card, position);
          recheckAll();
        }
      });
  }
}

persist().then(recheckAll());

function addToPosition(htmlText, position) {
  let el = document.createElement('div');
  el.innerHTML = htmlText;
  let list = `#simpleList${position}`;
  console.log(list);
  let positionEl = document.querySelector(list);
  positionEl.insertBefore(el.firstChild, positionEl.firstChild);
}

function generateCourseCards(array) {
  array.forEach(mod => {
    getModData(mod)
      .then(data => {
        moduleObjs.set(data.moduleCode, data);
        return data;
      })
      .then(data => {
        let color = getRandomItem(colors);
        let card = returnCard(data, color);
        addToBuffer(card);
        sessionStorage.setItem(data.moduleCode, 'b');
      });
  });
}

// Helper function
function returnCard(data, color) {
  return `<div class="list-group-item ${color}" id="${data.moduleCode}">
  <a href="https://nusmods.com/modules/${data.moduleCode}" target="_blank">${
    data.moduleCode
  }<br><span class="title">${data.title}</span></a>
  <span class='text-muted'>${data.moduleCredit} MCs</span>
  <button type="button" class="close" aria-label="Close" data-html2canvas-ignore>
  <span aria-hidden="true">&times;</span>
  </button>
  </div>`;
}

// Helper function
function getRandomItem(collection) {
  return collection[Math.floor(Math.random() * collection.length)];
}

// Global variables
const bufferEl = document.querySelector('#buffer');

function addToBuffer(htmlText) {
  let element = document.createElement('div');
  element.innerHTML = htmlText;
  bufferEl.appendChild(element.firstChild, bufferEl.firstChild);
}

function addToBufferTop(htmlText) {
  let element = document.createElement('div');
  element.innerHTML = htmlText;
  bufferEl.insertBefore(element.firstChild, bufferEl.firstChild);
}

// Listen for '.close' events
document.addEventListener('click', function(e) {
  if (e.target.parentNode) {
    if (e.target.parentNode.matches('.close')) {
      removeModule(e.target.parentNode.parentNode.id);
      e.target.parentNode.parentNode.remove();
      recheckAll();
    }
  }
});

//Add module button. Creates module card
const moduleForm = document.querySelector('#module-form');
moduleForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let moduleCode = document.querySelector('#module-code').value;
  if (moduleCode) {
    getModData(moduleCode)
      .then(data => {
        moduleObjs.set(data.moduleCode, data);
        return data;
      })
      .then(data => {
        // let elChild = document.createElement("div");
        let color = getRandomItem(colors);
        let card = returnCard(data, color);
        addToBufferTop(card);
        sessionStorage.setItem(data.moduleCode, 'b');
        document.querySelector('#module-code').value = '';
        document.querySelector('#buffer').scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
  }
});

// Course selector.
const courseForm = document.querySelector('#courseForm');

courseForm.addEventListener('submit', function(e) {
  e.preventDefault();
  document.querySelector('#course-button').disabled = true;
  let course = document.querySelector('#courseSelect').value;
  console.log(course);
  generateCourseCards(coreModules[course]);
});

function enableGenButton() {
  document.querySelector('#course-button').disabled = false;
}

// Toggle button 'active' class
const btn1 = document.querySelector('#btn1');
btn1.addEventListener('click', function() {
  this.classList.toggle('active');
});

const btn2 = document.querySelector('#btn2');
btn2.addEventListener('click', function() {
  this.classList.toggle('active');
});

// Add year 5
function addYear() {
  document.getElementById('add-year').style.display = 'none';
  let yr5 = document.querySelectorAll('#yr5');
  yr5.forEach(e => (e.style.display = 'block'));
}

//Remove year 5
function removeYear() {
  let yr5 = document.querySelectorAll('#yr5');
  yr5.forEach(e => (e.style.display = 'none'));
  document.getElementById('add-year').style.display = 'block';
}

function generateRandomCard() {
  let color = getRandomItem(colors);
  // let color = '';
  let alphabet = getRandomItem(alphabets);
  let result = `<div class="list-group-item ${color}">
            Module ${alphabet} <span class='text-muted'>4 MCs</span>
            <button type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`;
  return result;
}

let ssbutton = document.getElementById('btn-download');
let box = document.querySelector('.container');
ssbutton.addEventListener('click', function(e) {
  html2canvas(document.body).then(function(canvas) {
    console.log(canvas);
    saveAs(canvas.toDataURL(), 'myModules.png');
  });
});

function saveAs(uri, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    link.href = uri;
    link.download = filename;
    //Firefox requires the link to be in the body
    document.body.appendChild(link);
    //simulate click
    link.click();
    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}
// prettier-ignore
const coreModules = {
  'Computer Science': ['CS1010', 'CS1231', 'CS2030', 'CS2040', 'CS2100',
    'CS2103T', 'CS2105', 'CS2106', 'CS3230', 'IS1103', 'CS2101', 'ES2660', 
    'MA1521', 'MA1101R', 'ST2334'],
  
  'Business Analytics': ['BT1101', 'CS1010', 'EC1301', 'IS1103','MA1101R',
    'MA1521', 'MKT1705X', 'BT2101', 'BT2102', 'CS2030',  'CS2040', 'IS2101',
    'ST2334', 'BT3102', 'BT3102', 'BT3103', 'IS3103'],

  'Information Systems': [ 'CS1010', 'CS1231', 'IS1103', 'CS2030', 'CS2040',
    'CS2102', 'CS2105', 'IS2101', 'IS2102', 'IS2103', 'IS3103', 'IS3106',
    'IS4100', 'IS4103', 'MA1301', 'MA1312', 'MA1521', 'ST2334'],
  
  'Computer Engineering': ['CS1010', 'CS2040', 'CS2113T', 'CS1231', 'MA1511',
    'MA1512', 'MA1508E', 'CG1111', 'CG1112', 'ST2334', 'CS2101', 'CG2271', 
    'CG2027', 'CG2023', 'EE2026', 'EG2401A', 'CG3207', 'CG4002', 'EE4204',
    'CP3880', 'EG3611A', 'CS3230'],

  'Information Security': ['CS1010','CS1231','CS2040C','CS2100','CS2101',
    'CS2102','CS2105','CS2106','CS2107','CS2113T','CS3235 ','IFS4205',
    'IS1103','IS3103','IS4231','MA1101R','MA1521','ST2334'],

  'Biomedical Engineering': ['BN2102','BN2201','BN2202','BN2204','BN2301','BN2403','CM1501','CS1010E','EE2211','EG1311','EG2401A','ES1531','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010'],

  'Chemical Engineering': ['CN1101','CN1102','CN2101','CN2116','CN2121','CN2122','CN2125','CN3101','CN3102','CN3121','CS1010E','EE2211','EG1311','EG2401A','ES1531','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010'],

  'Civil Engineering': ['CE1101','CE1102','CE2112','CE2134','CE2155','CE2183','CE2407','CE2409','CE3115','CE3116','CE3121','CE3132','CE3155','CE3165','CE3166','CE4103','CE4104','CS1010E','EE2211','EG1311','EG2401A','EG3611A','ES1531','ESE3001','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010','PC1431'],

  'Electrical Engineering': ['CS1010E','EE2012A','EE2023','EE2026','EE2027','EE2028','EE2028A','EE2029','EE2033','EE2211','EG1311','EG2401A','ES1531','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010','PC2020'],

  'Environmental Engineering': ['E1101','CE2134','CE2409','CM1502','CS1010E','EE2211','EG1311','EG2401A','EG3611A','ES1531','ESE1001','ESE1102','ESE2001','ESE2401','ESE3101','ESE3201','ESE3301','ESE3401','ESE4501','ESE4502R','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010','PC1431'],

  'Industrial Systems Engineering and Management': ['CS1010E','EE2211','EG1311','EG2401A','ES1531','IE1111','IE1111R','IE1112','IE2100','IE2110','IE2111','IE2130','IE2140','IE2141','IE2150','IE3100M','IE3100R','IE3101','IE3110','IE3110R','IE4100R','IE4102','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010'],

  'Materials Science and Engineering': ['CS1010E','EE2211','EG1311','EG2401A','ES1531','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','MLE1010','MLE2101','MLE2103','MLE2104','MLE2105','MLE3101','MLE3111','MLE4101','MLE4102','MLLE2102'],
  
  'Mechanical Engineering': ['CS1010E','EE2211','EG1311','EG2401A','ES1531','IE2141','MA1505','MA1508E','MA1511','MA1512','MA1513','ME2102','ME2112','ME2115','ME2121','ME2134','ME2142','ME2151','ME3103','ME3162','ME4101A','ME4102','ME4103','MLE1010'],

  'Business Administration': ['DAO1704','DAO2702','BSP1703','BSP2701','ACC1701','BSP1702','MKT1705','MNO1706','FIN2704','DAO2703', 'MNO2705','BSP3701','ES2002'],

  'Business Administration (Accountancy)': ['DAO1704','DAO2702','BSP1707','BSP2701','ACC1701','BSP1702','MKT1705','MNO1706','FIN2704','DAO2703','MNO2706','BSP3701','ES2002'],

}

// Generate core module options
const courseSelect = document.querySelector('#courseSelect');
let counter = 0;
for (const key in coreModules) {
  let option = document.createElement('option');
  option.text = key;
  courseSelect.add(option);
  if (counter === 4 || counter === 12) {  
    let blank = document.createElement('option');
    blank.text = '____________';
    courseSelect.add(blank);
  }
  counter++;
}
