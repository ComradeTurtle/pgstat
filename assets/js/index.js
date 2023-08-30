document.getElementById('userInp').addEventListener('keyup', (ctx) => {
    const display = document.getElementById('tbody').getAttribute('displaying');
    const data = JSON.parse(window.sessionStorage.getItem(`data-${display}`));

    let table = document.getElementById('tbody');
    table.innerHTML = "";

    if (display === 'total') {
        document.getElementById('crtask').classList.add('d-none');
        document.getElementById('crtask1').classList.add('d-none');
    } else {
        document.getElementById('crtask').classList.remove('d-none');
        document.getElementById('crtask1').classList.remove('d-none');
    }

    let filtered = data.filter((e) => e.username.toLowerCase().includes(ctx.target.value.toLowerCase()));
    for (let i = 0; i < filtered.length; i++) {
        let row = document.createElement('tr');

        row.appendChild(document.createElement('td')).innerText = filtered[i].pos;

        let username = document.createElement('td');
        username.innerText = filtered[i].username;
        username.id = filtered[i].userId;
        username.style.cursor = 'pointer';
        row.appendChild(username);

        row.appendChild(document.createElement('td')).innerText = filtered[i].team;

        if (display !== 'total') {
            let credit = document.createElement('td');
            credit.innerText = data[i].credit;
            credit.style.cursor = 'pointer';
            row.appendChild(credit);

            let tasks = document.createElement('td');
            tasks.innerText = data[i].tasks;
            tasks.style.cursor = 'pointer';
            row.appendChild(tasks);
        }

        row.appendChild(document.createElement('td')).innerText = filtered[i].points;

        table.appendChild(row);
    }
})

const populate = async () => {
    const challenges = await fetch('https://pgapi.comradeturtle.dev/v1/challenges').then((res) => res.json());

    let challContainer = document.getElementById('challDrop');
    challenges.forEach((e) => {
        let el = document.createElement('a');
        el.classList.add('dropdown-item');
        el.style.cursor = 'pointer';
        el.id = e.name;
        el.innerText = `${e.name} | ${e.desc} (${e.projects})`;
        el.onclick = () => { tableDraw(e.name); document.getElementById('challDropTitle').innerText = `${e.desc} (${e.projects})`}

        challContainer.appendChild(el);
    })

    tableDraw();
}

const tableDraw = async (series) => {
    document.getElementById('loading').classList.remove('d-none');

    let data;
    if (window.sessionStorage.getItem(`data-${series ? series : 'total'}`)) {
        data = JSON.parse(window.sessionStorage.getItem(`data-${series ? series : 'total'}`));
    }
    else {
        data = await fetch(`https://pgapi.comradeturtle.dev/v1/points${series ? `?series=${series}` : ''}`).then((res) => res.json());
        window.sessionStorage.setItem(`data-${series ? series : 'total'}`, JSON.stringify(data));
    }
    
    let table = document.getElementById('tbody');
    table.innerHTML = "";
    table.setAttribute('displaying', series ? series : 'total');

    if (!series) {
        document.getElementById('crtask').classList.add('d-none');
        document.getElementById('crtask1').classList.add('d-none');
    } else {
        document.getElementById('crtask').classList.remove('d-none');
        document.getElementById('crtask1').classList.remove('d-none');
    }

    for (let i = 0; i < data.length; i++) {
        data[i].pos = i + 1;
        let row = document.createElement('tr');

        row.appendChild(document.createElement('td')).innerText = data[i].pos;

        let username = document.createElement('td');
        username.innerText = data[i].username;
        username.id = data[i].userId;
        username.style.cursor = 'pointer';
        row.appendChild(username);

        row.appendChild(document.createElement('td')).innerText = data[i].team;

        if (series) {
            let credit = document.createElement('td');
            credit.innerText = data[i].credit;
            credit.style.cursor = 'pointer';
            row.appendChild(credit);

            let tasks = document.createElement('td');
            tasks.innerText = data[i].tasks;
            tasks.style.cursor = 'pointer';
            row.appendChild(tasks);
        }

        row.appendChild(document.createElement('td')).innerText = data[i].points;

        table.appendChild(row);
    }
    
    window.sessionStorage.setItem(`data-${series ? series : 'total'}`, JSON.stringify(data));
    document.getElementById('loading').classList.add('d-none');
}

window.onload = populate;