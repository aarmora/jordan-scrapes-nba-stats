import axios from 'axios';
import * as  json2csv from 'json2csv';
import * as fs from 'fs';

(async () => {
	const halves = ['First+Half', 'Second+Half'];

	for (let halfIndex = 0; halfIndex < halves.length; halfIndex++) {
		const url = `https://stats.nba.com/stats/teamgamelogs?DateFrom=&DateTo=&GameSegment=${halves[halfIndex]}&LastNGames=0&LeagueID=00&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlusMinus=N&Rank=N&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision=`;

		const axiosResponse = await axios.get(url, {
			headers:
			{
				'Referer': 'https://stats.nba.com/teams/boxscores-advanced/?Season=2019-20&SeasonType=Regular%20Season&GameSegment=Second%20Half',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
			}
		});

		const headers = axiosResponse.data.resultSets[0].headers;
		const results = axiosResponse.data.resultSets[0].rowSet;


		const games: any[] = [];
		for (let i = 0; i < results.length; i++) {
			const game: any = {};
			const desiredIndice: number[] = [0, 3, 5, 6, 10, 12, 18, 21, 22, 23, 24];
			for (let resultsIndex = 0; resultsIndex < results[i].length; resultsIndex++) {
				// 
				console.log('list of indice', headers[resultsIndex]);

				if (desiredIndice.includes(resultsIndex)) {
					game[headers[resultsIndex]] = results[i][resultsIndex];
				}
			}
			games.push(game);

		}

		const csv = json2csv.parse(games);
		fs.writeFile(`nba-stats-${halves[halfIndex]}.csv`, csv, async (err) => {
			if (err) {
				console.log('err while saving file', err);
			}
		});
	}

})();