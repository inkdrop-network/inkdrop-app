import React from 'react'
import PropTypes from 'prop-types'
import { CardBody } from 'reactstrap'

import iconComment from '../../../../../public/icons/icon-comments.svg'

const MessageActions = ({ msg, toggleComments, toggleActions, drops, commentsNrClass }) => (
	<CardBody className="pt-2 pb-4">
		<div className="row">
			<div className="col">
				<div className="drop-message-button float-left" onClick={toggleActions}>
					{/* <img src={inkdropDark} width="20" height="20" className="drops" alt="" /> */}
					<span className="drop-number icon-number">{msg.drops} ETH</span>
				</div>
				<div className="comment-message-button float-right" onClick={toggleComments}>
					<img src={iconComment} width="20" height="20" className="" alt="comments" />
					<span className={`comment-number icon-number ml-1 ${commentsNrClass}`}>
						{msg.commentIds.length}
					</span>
				</div>
			</div>
		</div>
	</CardBody>
)

MessageActions.propTypes = {
	msg: PropTypes.shape({
		drops: PropTypes.number.isRequired,
		commentIds: PropTypes.array.isRequired,
	}).isRequired,
	toggleComments: PropTypes.func.isRequired,
	toggleActions: PropTypes.func.isRequired,
	drops: PropTypes.number.isRequired,
}

export default MessageActions
