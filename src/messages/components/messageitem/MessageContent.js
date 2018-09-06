import React from 'react'
import PropTypes from 'prop-types'
import { CardBody } from 'reactstrap'

const MessageContent = ({ msg }) => <CardBody className="py-2">{msg.content}</CardBody>

MessageContent.propTypes = {
	msg: PropTypes.shape({
		content: PropTypes.string.isRequired,
	}).isRequired,
}

export default MessageContent
