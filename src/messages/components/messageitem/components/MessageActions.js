import React from 'react'
import PropTypes from 'prop-types'
import { CardBody } from 'reactstrap'
import SVG from 'react-inlinesvg'

import iconComments from '../../../../../public/icons/icon-comments.svg'
import iconEther from '../../../../../public/icons/icon-ether.svg'

const MessageActions = ({ msg, toggleComments, toggleActions, drops, active }) => (
	<CardBody className="pt-2">
		<div className="row">
			<div className={`col icon-actions ${active ? 'active' : ''}`} onClick={toggleActions}>
				<SVG src={iconEther} wrapper={React.createFactory('div')} className="icon d-inline" />
				<div className="icon-number d-inline ml-1">{Number(msg.drops).toFixed(3)}</div>
			</div>

			<div className="col icon-actions text-right" onClick={toggleComments}>
				<SVG src={iconComments} wrapper={React.createFactory('div')} className="icon d-inline" />
				<div className="icon-number d-inline ml-1">{msg.commentIds.length}</div>
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
	active: PropTypes.bool.isRequired,
}

export default MessageActions
