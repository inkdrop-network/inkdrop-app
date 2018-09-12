import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Moment from 'react-moment'
import SVG from 'react-inlinesvg'

import iconDots from '../../../../../public/icons/icon-dots.svg'

const MessageHeader = ({ msg, extended }) => (
	<div className="d-flex flex-row">
		<Link to={`/user/${msg.userAdr}`} className="message-header-link">
			<img
				className="mr-2 profile-img"
				src={msg.userUrl || 'https://via.placeholder.com/50/85bd3e/85bd3e'}
				alt="profile"
			/>
		</Link>
		<div>
			<Link to={`/user/${msg.userAdr}`} className="message-header-link">
				<strong className="align-top d-block card-username">@{msg.username}</strong>
			</Link>
			<span className="card-message-time">
				<Moment fromNow>{msg.timestamp}</Moment>
			</span>
		</div>
		{extended && (
			<div className="icon-actions ml-auto" style={{ width: '30px', marginTop: '5px' }}>
				<SVG src={iconDots} wrapper={React.createFactory('div')} className="icon" />
			</div>
		)}
	</div>
)

MessageHeader.defaultProps = {
	extended: false,
}

MessageHeader.propTypes = {
	msg: PropTypes.shape({
		userUrl: PropTypes.string.isRequired,
		userAdr: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		timestamp: PropTypes.instanceOf(Date).isRequired,
	}).isRequired,
	extended: PropTypes.bool,
}

export default MessageHeader
