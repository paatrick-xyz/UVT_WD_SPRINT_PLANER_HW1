document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolio-form');
    const tableBody = document.getElementById('table-body');

    let savedProjects = JSON.parse(localStorage.getItem('myPortfolio')) || [];
    
    tableBody.innerHTML = ''; 
    savedProjects.forEach(project => {
        addProjectToTable(project);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        

        const name = document.getElementById('proj-name');
        const url = document.getElementById('proj-url');
        const date = document.getElementById('proj-date');
        const tech = document.getElementById('proj-tech');
        const desc = document.getElementById('proj-desc');

        // Validation checks
        if (name.value.trim() === '') {
            document.getElementById('name-error').textContent = 'Project name is required.';
            name.style.border = '2px solid #A52B35';
            isValid = false;
        }

        if (url.value.trim() === '') {
            document.getElementById('url-error').textContent = 'URL is required.';
            url.style.border = '2px solid #A52B35';
            isValid = false;
        }

        if (date.value === '') {
            document.getElementById('date-error').textContent = 'Date is required.';
            date.style.border = '2px solid #A52B35';
            isValid = false;
        }

        if (tech.value === '') {
            document.getElementById('tech-error').textContent = 'Technology is required.';
            tech.style.border = '2px solid #A52B35';
            isValid = false;
        }

        if (desc.value.trim() === '') {
            document.getElementById('desc-error').textContent = 'Description is required.';
            desc.style.border = '2px solid #A52B35';
            isValid = false;
        }

        if (isValid) {
            const newProject = {
                name: name.value,
                url: url.value,
                date: date.value,
                tech: tech.value,
                desc: desc.value
            };

            savedProjects.push(newProject);
            localStorage.setItem('myPortfolio', JSON.stringify(savedProjects));

            addProjectToTable(newProject);
            form.reset(); 
        }
    });

    form.addEventListener('reset', () => {
        document.querySelectorAll('.error-msg').forEach(span => span.textContent = '');
        document.querySelectorAll('input, select, textarea').forEach(input => input.style.border = 'none');
    });

    function addProjectToTable(project) {
        let finalUrl = project.url;
        if (!finalUrl.startsWith('http')) {
            finalUrl = 'https://' + finalUrl;
        }

        let newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td><img src="https://placehold.co/80x80/EFEFEF/000?text=${project.name.substring(0,2).toUpperCase()}" alt="Thumbnail" class="thumbnail-img" loading="lazy"></td>
            <td><strong>${project.name}</strong></td>
            <td>${project.desc}</td>
            <td><span class="inline-code">${project.tech}</span></td>
            <td>${project.date}</td>
            <td><a href="${finalUrl}" target="_blank" style="color: var(--pr4-color); font-weight: bold;">View App</a></td>
        `;

        tableBody.appendChild(newRow);
    }
});