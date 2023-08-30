const API_BASE = `https://pgapi.comradeturtle.dev`

document.getElementById('userInp').addEventListener('keyup', (ctx) => {
    const display = document.getElementById('tbody').getAttribute('displaying');
    const data = JSON.parse(window.sessionStorage.getItem(`data-indiv-${display}`));

    let table = document.getElementById('tbody');
    table.innerHTML = "";

    if (display.includes('total')) {
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

        if (display && !display.includes('total')) {
            let credit = document.createElement('td');
            credit.innerText = filtered[i].credit;
            credit.style.cursor = 'pointer';
            row.appendChild(credit);

            let tasks = document.createElement('td');
            tasks.innerText = filtered[i].tasks;
            tasks.style.cursor = 'pointer';
            row.appendChild(tasks);
        }

        row.appendChild(document.createElement('td')).innerText = filtered[i].points;

        table.appendChild(row);
    }
})

document.getElementById('teamInp').addEventListener('keyup', (ctx) => {
    const display = document.getElementById('tbodyTeam').getAttribute('displaying');
    const data = JSON.parse(window.sessionStorage.getItem(`data-team-${display}`));

    let table = document.getElementById('tbodyTeam');
    table.innerHTML = "";

    if (display.includes('total')) {
        document.getElementById('crtaskTeam').classList.add('d-none');
        document.getElementById('crtaskTeam1').classList.add('d-none');
    } else {
        document.getElementById('crtaskTeam').classList.remove('d-none');
        document.getElementById('crtaskTeam1').classList.remove('d-none');
    }

    let filtered = data.filter((e) => e.teamname.toLowerCase().includes(ctx.target.value.toLowerCase()));
    for (let i = 0; i < filtered.length; i++) {
        let row = document.createElement('tr');

        row.appendChild(document.createElement('td')).innerText = filtered[i].pos;

        let teamname = document.createElement('td');
        teamname.innerText = filtered[i].teamname;
        teamname.id = filtered[i].teamId;
        teamname.style.cursor = 'pointer';
        row.appendChild(teamname);

        if (display && !display.includes('total')) {
            let credit = document.createElement('td');
            credit.innerText = filtered[i].credit;
            credit.style.cursor = 'pointer';
            row.appendChild(credit);

            let tasks = document.createElement('td');
            tasks.innerText = filtered[i].tasks;
            tasks.style.cursor = 'pointer';
            row.appendChild(tasks);
        }

        row.appendChild(document.createElement('td')).innerText = filtered[i].points;

        table.appendChild(row);
    }
})

const populate = async () => {
    const challenges = await fetch(`${API_BASE}/v1/challenges`).then((res) => res.json());
    let years = [];

    let challContainer = document.getElementById('challDrop');
    challenges.reverse();
    challenges.forEach((e) => {
        let year = e.name.split('_')[0];
        if (!years.includes(year)) years.push(year);

        let el = document.createElement('a');
        el.classList.add('dropdown-item');
        el.style.cursor = 'pointer';
        el.id = e.name;
        el.innerText = `${e.name} | ${e.desc} (${e.projects})`;
        el.onclick = () => { tableDraw(e.name); document.getElementById('challDropTitle').innerText = `${e.desc} (${e.projects})` }

        challContainer.appendChild(el);
    })

    let challContainerTeam = document.getElementById('challDropTeam');
    challenges.forEach((e) => {
        let el = document.createElement('a');
        el.classList.add('dropdown-item');
        el.style.cursor = 'pointer';
        el.id = e.name;
        el.innerText = `${e.name} | ${e.desc} (${e.projects})`;
        el.onclick = () => { tableDraw(e.name, 'team'); document.getElementById('challDropTitleTeam').innerText = `${e.desc} (${e.projects})` }

        challContainerTeam.appendChild(el);
    })

    years.reverse();
    years.forEach((e) => {
        let el = document.createElement('a');
        el.classList.add('dropdown-item');
        el.style.cursor = 'pointer';
        el.innerText = `All Challenges (${e})`;
        el.onclick = () => { tableDraw(`total_${e}`); document.getElementById('challDropTitle').innerText = `All Challenges (${e})` }

        let el2 = document.createElement('a');
        el2.classList.add('dropdown-item');
        el2.style.cursor = 'pointer';
        el2.innerText = `All Challenges (${e})`;
        el2.onclick = () => { tableDraw(`total_${e}`, 'team'); document.getElementById('challDropTitleTeam').innerText = `All Challenges (${e})` }

        challContainer.prepend(el);
        challContainerTeam.prepend(el2);
    })

    fetchVer();
    tableDraw(`total_${years[years.length - 1]}`);
    tableDraw(`total_${years[years.length - 1]}`, 'team');
}

const tableDraw = async (series, mode = 'indiv') => {
    document.getElementById('loading').classList.remove('d-none');

    let data;
    if (window.sessionStorage.getItem(`data-${mode}-${series ? series : 'total'}`)) {
        data = JSON.parse(window.sessionStorage.getItem(`data-${mode}-${series ? series : 'total'}`));
    }
    else {
        data = await fetch(`${API_BASE}/v1/points${mode === 'indiv' ? '' : '/teams'}${series && series !== 'total' ? `?series=${series}` : ''}`).then((res) => res.json());
        window.sessionStorage.setItem(`data-${mode}-${series ? series : 'total'}`, JSON.stringify(data));
    }

    let table = document.getElementById(mode === 'indiv' ? 'tbody' : 'tbodyTeam');
    table.innerHTML = "";
    table.setAttribute('displaying', series ? series : 'total');

    if (!series || series.includes('total')) {
        document.getElementById(mode === 'indiv' ? 'crtask' : 'crtaskTeam').classList.add('d-none');
        document.getElementById(mode === 'indiv' ? 'crtask1' : 'crtaskTeam1').classList.add('d-none');
    } else {
        document.getElementById(mode === 'indiv' ? 'crtask' : 'crtaskTeam').classList.remove('d-none');
        document.getElementById(mode === 'indiv' ? 'crtask1' : 'crtaskTeam1').classList.remove('d-none');
    }

    for (let i = 0; i < data.length; i++) {
        data[i].pos = i + 1;
        let row = document.createElement('tr');

        if (mode === 'indiv') {
            row.appendChild(document.createElement('td')).innerText = data[i].pos;

            let username = document.createElement('td');
            username.innerText = data[i].username;
            username.id = data[i].userId;
            username.style.cursor = 'pointer';
            row.appendChild(username);

            row.appendChild(document.createElement('td')).innerText = data[i].team;

            if (!series.includes('total')) {
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
        } else {
            row.appendChild(document.createElement('td')).innerText = data[i].pos;

            let teamname = document.createElement('td');
            teamname.innerText = data[i].teamname;
            teamname.id = data[i].teamId;
            teamname.style.cursor = 'pointer';
            row.appendChild(teamname);

            if (!series.includes('total')) {
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
    }

    window.sessionStorage.setItem(`data-${mode}-${series ? series : 'total'}`, JSON.stringify(data));
    document.getElementById('loading').classList.add('d-none');
}

const fetchVer = async () => {
    const data = await fetch(`${API_BASE}/v1/statistics`).then((res) => res.json());

    document.getElementById('ver').innerText = `${data.version}`;
    document.getElementById('ver').onclick = () => window.location.href = 'https://github.com/ComradeTurtle/pgstat/releases/tag/'+data.version;
}

window.onload = populate;