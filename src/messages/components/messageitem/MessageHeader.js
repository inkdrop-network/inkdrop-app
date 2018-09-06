import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Moment from 'react-moment'
import { CardBody } from 'reactstrap'

const MessageHeader = ({ msg }) => (
	<CardBody className="d-flex flex-row pb-2">
		<img
			className="mr-2 profile-img"
			src={msg.userUrl || 'https://via.placeholder.com/50/85bd3e/85bd3e'}
			alt="profile"
		/>
		<div>
			<Link to={`/user/${msg.userAdr}`} className="">
				<strong className="align-top d-block card-username">@{msg.username}</strong>
			</Link>
			<span className="card-message-time">
				<Moment fromNow>{msg.timestamp}</Moment>
			</span>
		</div>
	</CardBody>
)

MessageHeader.propTypes = {
	msg: PropTypes.shape({
		userUrl: PropTypes.string.isRequired,
		userAdr: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		timestamp: PropTypes.instanceOf(Date).isRequired,
	}).isRequired,
}

export default MessageHeader
