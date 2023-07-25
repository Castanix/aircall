import React, { useContext, useState, useEffect } from 'react';
import { Spin, Divider, Collapse, Avatar, Typography } from 'antd';
import { BsFillTelephoneInboundFill, BsFillTelephoneOutboundFill } from 'react-icons/bs';
import { ArchiveActionContext, TabContext } from '../../App.jsx';
import { getCalls, archiveCall, unarchiveCall, unarchiveAll } from '../../fetch/activities-api.js';

import './call-list.css';
import CallDetails from './CallDetails.jsx';

const { Title } = Typography;

/**
 * Formats the call list to be rendered by creating and sorting an array of call objects
 * based on the date they were created and the archive status.
 * 
 * @param calls The array of call objects.
 * @param setIsLoading Optional function to be passed into child component in order to update states
 * @return A pair containing the array of element objects to be rendered for activity and archived call list.
 * 
 */
const formatLists = (calls, setIsLoading = () => {}) => {
	const dataDateList = {};

	// Creates key-values based on date and archive status into dataDateList object
	calls.forEach(call => {
		const date = call.created_at.substring(0, 10);

		const status = call.is_archived ? 'archived' : 'activity';

		if (dataDateList[date + ' - ' + status]) dataDateList[date + ' - ' + status].push(call)
		else dataDateList[date + ' - ' + status] = [call]
	});

	const activityArr = [];
	const archivedArr = [];

	// Creates array of element objects to be rendered, sorted by date and status based on dataDateList object
	Object.keys(dataDateList).forEach(dateStatus => {
		const [date, status] = dateStatus.split(' - ');

		const dividerEl = <Divider key={dateStatus}>{date}</Divider>

		const items = [];
		dataDateList[dateStatus].forEach((item, index) => {
			items.push({
				key: index,
				label: 
					<div>
						<Avatar 
							size={24} 
							style={{marginTop: '-0.5rem'}}
							icon={item.direction == 'inbound' 
								? <BsFillTelephoneInboundFill color={item.call_type == 'answered' ? 'green' : 'red'} /> 
								: <BsFillTelephoneOutboundFill color={item.call_type == 'answered' ? 'green' : 'red'} />}
						/>
						<Title style={{display: 'inline'}} level={4}>{item.via ? item.via : 'Unknown number'}</Title>
						<p style={{color: 'rgba(0, 0, 0, 0.5)'}}>{item.call_type ? item.call_type : 'missed'}</p>
					</div>,
				children: <CallDetails item={item} setIsLoading={setIsLoading} />
			})
		})

		const listEl = <Collapse key={dateStatus + '-list'} accordion items={items} />

		if (status == 'activity') {
			activityArr.unshift(dividerEl, listEl);
		} else {
			archivedArr.unshift(dividerEl, listEl);
		}
	});

	return [activityArr, archivedArr];
}

/**
 * Component fetches calls from the server and renders the call list for both 
 * activities and archived calls based on the active tab.
 * 
 * @return The rendered component
 * 
 */
const CallList = () => {
	const { tab } = useContext(TabContext);
	const { archiveAction, setArchiveAction } = useContext(ArchiveActionContext);

	const [calls, setCalls] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (archiveAction && tab == 'archived') unarchiveAll(setIsLoading)

		if (archiveAction && tab == 'activity') {
			calls.forEach(call => {
				if (!call.is_archived) archiveCall(call.id);
			});

			setIsLoading(true);
		}

		setArchiveAction(false);
	}, [archiveAction, setArchiveAction, setIsLoading]);

	useEffect(() => {
		getCalls(setCalls, setIsLoading);
	}, [isLoading, setIsLoading]);

	if (isLoading) return <div className='loading-activities'><Spin tip='Loading activities' size='large' ><div className='content' /></Spin></div>;

	const [activityArr, archivedArr] = formatLists(calls, setIsLoading);

	return (
		<div className='calllist-container'>
			{
				tab == 'activity'
				? (activityArr.length > 0 ? activityArr : <div className='empty-list-info'>No call activity</div>)
				: (archivedArr.length > 0 ? archivedArr : <div className='empty-list-info'>No archived calls</div>)
			}
		</div>
	)
}

export default CallList