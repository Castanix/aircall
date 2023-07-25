import React, { useContext, useState, useEffect } from 'react'
import { Typography, Button, Popover, Space } from 'antd';
import { TabContext } from '../../App.jsx';
import { archiveCall, unarchiveCall } from '../../fetch/activities-api.js';

const { Title } = Typography;

/**
 * Child component which renders and keeps track of states for call details.
 * Used in the CallList parent component.
 * 
 * @param item The call object containing details.
 * @param setIsLoading The function used to update the loading state in the parent component
 * @return The rendered component
 * 
 */
const CallDetails = ({item, setIsLoading}) => {
	const { tab } = useContext(TabContext);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.getElementsByClassName("calllist-container")[0].addEventListener("scroll", () => setIsOpen(false))

		return () => document.getElementsByClassName("calllist-container")[0].removeEventListener("scroll", () => setIsOpen(false))
	}, [])

  return (
    <div>
      <Title level={5}>Details</Title>
			<p>
					Called on: {new Date(item.created_at).toString().split(' ', 5).join(' ')} <br />
					Duration: {item.duration ? item.duration : 0} <br />
					From: {item.from ? item.from : 'Unknown number'} <br />
					To: {item.to ? item.to : 'Unknown number'} <br />
					Call Status: {item.call_type ? item.call_type : 'missed'}
			</p>
			<div style={{textAlign: 'center'}}>
				<Popover
					content={
						<div>
							<Space>
								<Button onClick={() => {
									tab == "activity" 
										? archiveCall(item.id) 
										: unarchiveCall(item.id);
									setIsLoading(true);
									}} type='primary'>Confirm</Button>
								<Button onClick={() => setIsOpen(false)}>Cancel</Button>
							</Space>
						</div> 
					}
					title={tab == 'activity' ? 'Archive call?' : 'Unarchive call?'}
					trigger='click'
					open={isOpen}
				>
					<Button style={{marginTop: '0.5rem'}} onClick={() => setIsOpen(!isOpen)}>{tab == 'activity' ? 'Archive call' : 'Unarchive call'}</Button>
				</Popover>
			</div>
    </div>
  )
}

export default CallDetails