import { useEffect, useState } from 'react';

import './App.css';

const baseUrl = 'http://localhost:3000';

const calculateRewardPoints = (amount) => {
	let points = 0;
	if (amount > 100) {
		points += (amount - 100) * 2;
		amount = 100;
	}

	if (amount > 50) {
		points += amount - 50;
	}

	return points;
};

const calculateRewards = (transactions) => {
	const monthlyRewardPoints = {};
	transactions.forEach((transaction) => {
		const date = new Date(transaction.date);
		const month = `${date.getFullYear()}-${
			date.getMonth() + 1
		}-${date.getDate()}`; // Format: 'YYYY-MM-DD'
		const points = calculateRewardPoints(transaction.amount);

		if (!monthlyRewardPoints[month]) {
			monthlyRewardPoints[month] = 0;
		}
		monthlyRewardPoints[month] += points;
	});

	return monthlyRewardPoints;
};

// Dummy Data

const DATA = [
	{
		date: '2023-07-15',
		amount: 120,
	},
	{
		date: '2023-07-19',
		amount: 180,
	},
];

const useTransactions = () => {
	const [isLoading, setLoading] = useState(false);
	const retrieveTransactions = async () => {
		try {
			setLoading(true);
			const url = `${baseUrl}/transactions`;
			const res = await fetch(url);
			const data = await res.json();
			setLoading(false);
			return data;
		} catch (error) {
			setLoading(false);
		}
	};

	return {
		retrieveTransactions,
		isLoading,
	};
};

function App() {
	const [total, setTotal] = useState(null);
	const { isLoading, retrieveTransactions } = useTransactions();

	useEffect(() => {
		(async () => {
			const transactions = await retrieveTransactions();
			const rewards = calculateRewards(transactions);
			// const data = calculateRewards(DATA);
			setTotal(rewards);
		})();
	}, []);

	return (
		<>
			<div className='container'>
				<table>
					<thead>
						<tr>
							<th>Month</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr rowSpan='2'>
								<td>Loading</td>
							</tr>
						) : (
							total &&
							Object.keys(total).map((month) => (
								<tr key={month}>
									<td className=''>{month}</td>
									<td>{total[month]}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default App;
