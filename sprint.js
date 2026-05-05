//localStorage
// { name: 'ASD Test', description: 'Some desc', priority: 2, column: 'next' }

function saveSprints(sprintsArray) {
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

function updateColumnCounter(){
    let columns=[
        {section: '.c0', label: 'Sprinted'},
        {section: '.c1', label: 'Current Sprint'},
        {section: '.c2', label: 'Next Sprint'}
    ];
    columns.forEach(function(col){
        let content = document.querySelector(col.section + ' .column-content');
        let header = document.querySelector(col.section + ' .column-header h3');
        if (content === null || header === null) return;
        let count = content.querySelectorAll('article').length;
        header.textContent = col.label + ' (' + count + ')';
    });
}

function buildCardElement(sprint, index){
    let article = document.createElement('article');
    article.className = 'sprint-card sc'+ sprint.priority; // making the class of the new card matching the format sc + priority + e (sprint-card-expended sc0e")
    article.draggable = true;
    article.dataset.index = index;
    article.innerHTML = '<div class="card-inner">'+
    '<svg class="dropdown-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4V10C4 12.2091 5.79086 14 8 14H20M20 14L16 10M20 14L16 18" ' +
    'stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
    '</svg>'+
    '<h4>'+sprint.name+'</h4>' +
    '<div class="delete-button">'+
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M3 6H5H21M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"' +
    'stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
    '</svg>'+
    '</div>'+
    '<div class="priority-circle">'+ sprint.priority +'</div>'+
    '</div>'+
    '<div class="card-body" style="display: none;">'+
    '<h5>Description</h5>'+
    '<div class="desc-box">'+
    '<p>'+sprint.description+'</p>'+
    '</div>'+
    '</div>';
    return article;

}

function getColumnName(columnElement){
    let section = columnElement.closest('.board-column');
    if(section.classList.contains('c0')) return 'sprinted';
    if(section.classList.contains('c1')) return 'curent';
    if(section.classList.contains('c2')) return 'next';
    return null;
}

function getColumnElement(columnName){
    if(columnName === 'sprinted') return document.querySelector('.c0 .column-content');
    if(columnName === 'curent') return document.querySelector('.c1 .column-content');
    if(columnName === 'next') return document.querySelector('.c2 .column-content');
    return null;
}
//page load, append it to the right column, if not skiped;

let sprints = loadSprints();
sprints.forEach(function(sprint, index){
    let card = buildCardElement(sprint, index);
    let column = getColumnElement(sprint.column);
    if(column !== null){
        column.appendChild(card);
        console.log('Card index:', index);
    }
});

document.querySelectorAll('.card-body').forEach(function(body) {
    body.style.display = 'none';
    body.dataset.open = 'false';
});

console.log('Page load complete. Cards rendered:', sprints.length);
updateColumnCounter();
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
    let newCard = {
        name:sprintName,
        description:sprintDescription,
        priority:selectedPriority,
        column:'next'
    };
    sprints.push(newCard);
    saveSprints(sprints);
    let card = buildCardElement(newCard,sprints.length);
    let column = getColumnElement('next');
    column.appendChild(card);
    console.log('New sprint saved and added to board:', newCard);
    updateColumnCounter();
    document.getElementById('sprint-name').value = '';
    document.getElementById('sprint-desc').value = '';
    selectedPriority = -1;
    priorityButtons.forEach(function(btn) {
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });
    console.log('Form reset after submission.');
    window.location.reload(); // seams like when i create a new sprint and try to move it to antother column the index is not updating and after i refresh the page there is no problem :)

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


//DRAG & DROP SRRINTS
//dragstart - event from the moment of the initial drag
//dragover - fires to the column, need preventDefoult to allow drags
//drop - fire to the column when click released

let draggedCard = null;
let draggedIndex = -1;

document.querySelector('.sprint-board').addEventListener('dragstart', function(event) {
    let card = event.target.closest('article');
    if (card === null) return;
    draggedCard = card;
    draggedIndex = parseInt(card.dataset.index);
    card.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    console.log('Drag started:', draggedCard, 'Index:', draggedIndex);
});

document.querySelector('.sprint-board').addEventListener('dragend', function(event) {
    if(draggedCard !== null){
        draggedCard.classList.remove('dragging');
    }
    draggedCard = null;
    draggedIndex = -1;
    console.log('Drag ended.');
});

let columns = document.querySelectorAll('.column-content');

columns.forEach(function(column) {
    column.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        console.log('Drag over column:', column);
    });

    column.addEventListener('dragenter', function(event) {
        event.preventDefault();
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', function(event) {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', function(event) {
        event.preventDefault();
        column.classList.remove('drag-over');
        if(draggedCard === null) return;
        column.appendChild(draggedCard);
        let newColumn = getColumnName(column);
        sprints[draggedIndex].column = newColumn;
        saveSprints(sprints);
        console.log('Card dropped in column:', newColumn, 'Updated sprint:', sprints[draggedIndex]);
        updateColumnCounter();
    });

});

//delete card drom div svg, need to find the card and delete it from the array and local storage

document.querySelector('.sprint-board').addEventListener('click', function(event) {
    let deleteBtn = event.target.closest('.delete-button');
    if (deleteBtn === null) return;
    let card= deleteBtn.closest('article');
    if (card === null) return;
    let index = parseInt(card.dataset.index);
    sprints.splice(index, 1);
    saveSprints(sprints);
    card.remove();
    console.log('Card deleted. Index:', index, 'Updated sprints:', sprints);
    updateColumnCounter();
});