//localStorage
// { name: 'ASD Test', description: 'Some desc', priority: 2, column: 'next' }

function saveSprint(sprintsArray) {
    let jsonString = JSON.stringify(sprintsArray);
    localStorage.setItem('sprints', jsonString);
    console.log('Saved to localStorage:', jsonString);
}

function loadSprints(){
    let jsonString = localStorage.getItem('sprints');
    if(jsonString === null){
        console.log('No saved sprints found in local.');
        return [];
    }
    let sprintsArray = JSON.parse(jsonString);
    console.log('Loaded from localStorage:', sprintsArray);
    return sprintsArray;
}

function buildCardElement(sprint){
    let article = document.createElement('article');
    article.className = 'sprint-card sc'+ selectedPriority; // making the class of the new card matching the format sc + priority + e (sprint-card-expended sc0e")
    article.innerHTML = '<div class="card-inner">'+
    '<svg class="dropdown-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4V10C4 12.2091 5.79086 14 8 14H20M20 14L16 10M20 14L16 18" ' +
    'stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
    '</svg>'+
    '<h4>'+sprintName+'</h4>'
    +'<div class="priority-circle">'+selectedPriority+'</div>'+
    '</div>'+
    '<div class="card-body" style="display: none;">'+
    '<h5>Description</h5>'+
    '<div class="desc-box">'+
    '<p>'+sprintDescription+'</p>'+
    '</div>'+
    '</div>';
    return article;
}

function getColumnElement(columnName){
    if(columnName === 'sprinted') return document.querySelector('.c0 .column-content');
    if(columnName === 'curent') return document.querySelector('.c1 .column-content');
    if(columnName === 'next') return document.querySelector('.c2 .column-content');
    return null;
}
//page load, append it to the right column, if not skiped;

let sprints = loadSprints();
sprints.forEach(function(sprint){
    let card = buildCardElement(sprint);
    let column = getColumnElement(sprint.column);
    if(column !== null){
        column.appendChild(card);
        //console.log('Card added to column:', sprint);
    }
});

document.querySelectorAll('.card-body').forEach(function(body) {
    body.style.display = 'none';
    body.dataset.open = 'false';
});

console.log('Page load complete. Cards rendered:', sprints.length);

//ADD SPRINT CARD
// First need the priority, so i get them from click events, but looks like after it clicks the circle is not reseting so i need to loop the other buttons and reset thjem

let selectedPriority = -1; //getting the priority btn by listening

let priorityButtons = document.querySelectorAll('.priority-btn');

priorityButtons.forEach(function(btn){
    btn.addEventListener('click', function() { // listening for click on the priority btn
        priorityButtons.forEach(function(otherBtn) {
            otherBtn.style.backgroundColor = ''; 
            otherBtn.style.color = '';
        }); // reset the color of all buttons

        selectedPriority = parseInt(btn.textContent);
        let btnColor = getComputedStyle(btn).color;
        btn.style.backgroundColor = btnColor;
        btn.style.color = '#fff';
        console.log('Selected Priority:', selectedPriority);
        });
}); 


let sprintForm = document.querySelector('.add-sprint'); //creating the card and linking it to the column, reseting the form after submit


sprintForm.addEventListener('submit', function(event) {
    event.preventDefault(); // no refresh
    let sprintName = document.getElementById('sprint-name').value;
    let sprintDescription = document.getElementById('sprint-desc').value;

    console.log('Sprint Name:', sprintName);
    console.log('Sprint Description:', sprintDescription);
    console.log('Selected Priority:', selectedPriority);

    if(sprintName===''){
        alert('Please enter a sprint name.');
        return;
    }
    if(sprintDescription===''){
        alert('Please enter a sprint description.');
        return;
    }
    if(selectedPriority === -1){
        alert('Please select a priority.');
        return;
    }
    let newCard = document.createElement('article');
    newCard.className = 'sprint-card-expended sc'+ selectedPriority + 'e'; // making the class of the new card matching the format sc + priority + e (sprint-card-expended sc0e")
    newCard.innerHTML = '<div class="card-inner">'+
    '<svg class="dropdown-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4V10C4 12.2091 5.79086 14 8 14H20M20 14L16 10M20 14L16 18" ' +
    'stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
    '</svg>'+
    '<h4>'+sprintName+'</h4>'
    +'<div class="priority-circle">'+selectedPriority+'</div>'+
    '</div>'+
    '<div class="card-body">'+
    '<h5>Description</h5>'+
    '<div class="desc-box">'+
    '<p>'+sprintDescription+'</p>'+
    '</div>'+
    '</div>';

    let nextSprintColumn = document.querySelector('.c2 .column-content');
    nextSprintColumn.appendChild(newCard);
    console.log('New sprint card added to the column.');

    document.getElementById('sprint-name').value = '';
    document.getElementById('sprint-desc').value = '';
    selectedPriority = -1;
    priorityButtons.forEach(function(btn) {
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });
    console.log('Form reset after submission.');

    //<div class="card-inner">
    //                    <svg class="dropdown-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //                        <path d="M4 4V10C4 12.2091 5.79086 14 8 14H20M20 14L16 10M20 14L16 18" 
    //                            stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    //                    </svg>
    //                    <h4>Homework SPRINT</h4>
    //                    <div class="priority-circle">0</div>
    //                </div>
    //                <div class="card-body">
    //                    <h5>Description</h5>
    //                    <div class="desc-box">
    //                        <p>This is a simple description for the homework sprint.</p>
    //                    </div>
    //                </div>
});


// COLAPSE AND EXPAND CARD

document.addEventListener('click', function(event) { // dropdown for the card
    let arrow = event.target.closest('.dropdown-arrow');
    if (arrow===null) return;
    let cardInner = arrow.closest('.card-inner');
    let card = arrow.closest('article');
    let cardBody = cardInner.nextElementSibling;

    if(cardBody===null){
        cardBody = document.createElement('div');
        cardBody.className   = 'card-body';
        cardBody.style.display = 'none'; // start hidden, the toggle below will open it
        cardBody.innerHTML =
            '<h5>Description</h5>' +
            '<div class="desc-box"><p>No description provided.</p></div>';
 
        card.appendChild(cardBody);
        console.log('No card body found — created one on the fly.');
        card.className = card.className.replace('sprint-card ', 'sprint-card-expended ');
    }
    let isExp = cardBody.dataset.open === 'true';
    if(isExp){
        cardBody.style.display = 'none';
        //arrow.style.transform = 'rotate(0deg)';
        cardBody.dataset.open = 'false';
        card.className = card.className.replace('sprint-card-expended ', 'sprint-card ');
        console.log('Card collapsed.');
    } else {
        cardBody.style.display = 'block';
        //arrow.style.transform = 'rotate(180deg)';
        cardBody.dataset.open = 'true';
        card.className = card.className.replace('sprint-card ', 'sprint-card-expended ');
        console.log('Card expanded.');
    }
});

let allCards = document.querySelectorAll('.card-body');

allCards.forEach(function(body) {
    body.style.display = 'none';
    body.dataset.open = 'false';
});
console.log('All card collapsed on page load Count:', allCards.length);