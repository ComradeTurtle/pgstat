export const getValues = async () => {
    const route = useRoute();
    const mode = route.path === '/teams' ? 'team' : 'indiv';

    const config = useAppConfig();
    const challengeDropdown = useState("challengeDropdown");
    const dropdownLabel = useState("dropdownLabel");
    const tableContent = useState("tableContent");

    const challenges = await fetch(`https://pgapi.comradeturtle.dev/v1/challenges`).then((res) => res.json());
    let years = [];
    let challengeList = [];
    const defInx = challenges.findIndex((e) => e.isStarting === 1);
    const defaultChallenge = challenges[defInx];
    console.log(`hello, getValues: defInx is ${defInx}`, defaultChallenge)
    challenges.reverse();
    challenges.forEach((e) => {
        const year = e.name.split('_')[0];
        const inx = e.name.split('_')[1];

        if (years.findIndex((e) => e.label === `All Challenges (${year})`) === -1) years.push({
            label: `All Challenges (${year})`,
            year: year,
            click: () => {
                dropdownLabel.value = `All Challenges (${year})`;
                tableContent.value = [];
                tableDraw(`total_${year}`, mode);
            }
        })

        challengeList.push({
            label: `${inx}/${year} | ${e.desc} (${e.projects})`,
            click: () => {
                dropdownLabel.value = `${inx}/${year} | ${e.desc} (${e.projects})`;
                tableContent.value = [];
                if(defInx !== -1 && defaultChallenge.name === `${year}_${inx}`) tableDraw(`${year}_${inx}`, mode, true);
                else tableDraw(`${year}_${inx}`, mode);
            }
        })
    })

    challengeDropdown.value = [];
    challengeDropdown.value.push(years);
    challengeDropdown.value.push(challengeList);

    // search for object that has attribute isStarting = true, and set it as default
    if (defInx !== -1) {
        dropdownLabel.value = `${defaultChallenge.name.split('_')[1]}/${defaultChallenge.name.split('_')[0]} | ${defaultChallenge.desc} (${defaultChallenge.projects})`;
        await tableDraw(defaultChallenge.name, mode, true);
    } else {
        dropdownLabel.value = years[0].label;
        tableContent.value = [];
        await tableDraw(`total_${years[0].year}`, mode);
    }
}

export const tableDraw = async (series, mode = 'indiv', isStarting = false, bypass = false) => {
    useState("isStarting").value = isStarting;

    console.log(`hello, tableDraw(${series}, ${mode}, ${isStarting})`);
    return new Promise(async (resolve, reject) => {
        let data;
        if (isStarting) {
            console.log(`Overriding selection, we're starting!`);
            if (!bypass) initUpdate(series);
            data = await fetch(`https://pgapi.comradeturtle.dev/v1/points${mode === 'indiv' ? '' : '/teams'}${series && series !== 'total' ? `?series=${series}` : ''}`).then((res) => res.json());
        } else if (useState(`data-${mode}-${series ? series : 'total'}`).value) {
            console.log(`Reusing state data-${mode}-${series ? series : 'total'}`);
            data = useState(`data-${mode}-${series ? series : 'total'}`);
        } else {
            console.log(`Fetching from API https://pgapi.comradeturtle.dev/v1/points${mode === 'indiv' ? '' : '/teams'}${series && series !== 'total' ? `?series=${series}` : ''}`)
            data = await fetch(`https://pgapi.comradeturtle.dev/v1/points${mode === 'indiv' ? '' : '/teams'}${series && series !== 'total' ? `?series=${series}` : ''}`).then((res) => res.json());
            useState(`data-${mode}-${series ? series : 'total'}`, () =>  data);
        }

        if (!isStarting) {
            if (useState("updInterval").value) {
                clearInterval(useState("updInterval").value);
                console.log(`interval cleared tableDraw`);
            }
        }

        for (let i = 0; i < data.length; i++) {
            data[i].pos = i+1;
        }

        let isStartingCols = [];

        let teamIndivCols = [];
        if (mode === 'team') {
            teamIndivCols = [
                {
                    key: 'teamname',
                    label: 'Team'
                }
            ]
        } else {
            teamIndivCols = [
                {
                    key: 'username',
                    label: 'User',
                },
                {
                    key: 'team',
                    label: 'Team'
                }
            ]
        }

        if (!series.includes('total')) {
            useState("tableColumns").value = [
                {
                    key: 'pos',
                    label: 'Position',
                },
                ...teamIndivCols,
                {
                    key: 'credit',
                    label: 'Credit'
                },
                {
                    key: 'tasks',
                    label: 'Tasks'
                },
                {
                    key: 'points',
                    label: 'Points',
                    sortable: true
                },
                ...isStartingCols
            ]
        } else {
            useState("tableColumns").value = [
                {
                    key: 'pos',
                    label: 'Position',
                },
                ...teamIndivCols,
                {
                    key: 'points',
                    label: 'Points',
                    sortable: true
                },
                ...isStartingCols
            ]
        }

        useState("tableContent").value = data;
        resolve();
    })
}

export const getStatistics = async () => {
    const data = await fetch(`https://pgapi.comradeturtle.dev/v1/statistics`).then((res) => res.json());
    useState("appVersion").value = data.version;
}

export const initUpdate = async (series) => {
    let i = 120;
    const stats = await fetch(`https://pgapi.comradeturtle.dev/v1/challenges`).then((res) => res.json());
    useState("lastUpdate").value = new Date((stats.find((s) => s.name === series).updated) * 1000);

    const interval = setInterval(async () => {
        i--;
        console.log(`interval ${i}`)
        useState("updCountdown").value = i;
        if (i === 0) {
            i = 120;

            const route = useRoute();
            const mode = route.path === '/teams' ? 'team' : 'indiv';
            const stats = await fetch(`https://pgapi.comradeturtle.dev/v1/challenges`).then((res) => res.json());

            useState("lastUpdate").value = new Date((stats.find((s) => s.name === series).updated) * 1000);
            await tableDraw(series, mode, true, true);
        }
    }, 1000)

    useState("updInterval").value = interval;
}

export const getMinutes = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m${seconds === 0 ? '' : ` ${seconds}s`}`;
}