const getCalls = (setCalls, setIsLoading) => {
	fetch('https://cerulean-marlin-wig.cyclic.app/activities')
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw response;
		})
		.then(results => {
			setCalls(results);
			setIsLoading(false);
		})
		.catch(err => {
			console.error('Error fetching calls.', err);
		});
}

const archiveCall = (call_id, setIsLoading) => {
	fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${call_id}`, {
		method: 'PATCH',
		body: JSON.stringify({
			'is_archived': true
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	})
		.then(response => {
			if (response.ok) setIsLoading(true)
			else throw response;
		})
		.catch(err => {
			console.error(`Error archiving call id $${call_id}.`, err);
		});
}

const unarchiveCall = (call_id) => {
	fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${call_id}`, {
		method: 'PATCH',
		body: JSON.stringify({
			is_archived: false
		})
	})
		.then(response => {
			if (!response.ok) throw response;
		})
		.catch(err => {
			console.error(`Error unarchiving call id $${call_id}.`, err);
		});
}

const unarchiveAll = (setIsLoading) => {
	fetch('https://cerulean-marlin-wig.cyclic.app/reset', {
		method: 'PATCH',
	})
		.then(response => {
			if (response.ok) setIsLoading(true)
			else throw response;
		})
		.catch(err => {
			console.error(`Error unarchiving all calls id.`, err);
		});
}


export {
	getCalls,
	archiveCall,
	unarchiveCall,
	unarchiveAll
}