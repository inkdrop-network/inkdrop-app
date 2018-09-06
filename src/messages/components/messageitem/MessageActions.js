import React from 'react'
import PropTypes from 'prop-types'
import { CardBody, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

import iconComment from '../../../../public/icons/icon-comments.svg'

const MessageActions = ({
	msg,
	toggleComments,
	onDropsChange,
	dropMessage,
	drops,
	commentsNrClass,
}) => (
	<CardBody className="pt-2">
		<div className="row">
			<div className="col">
				<div className="drop-message-button float-left">
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

		<div className="d-none">
			<div className="col-4">
				<InputGroup size="sm">
					<Input
						type="number"
						value={drops}
						min="0.001"
						max="100"
						step="0.001"
						onChange={onDropsChange}
					/>
					<InputGroupAddon addonType="append" onClick={dropMessage}>
						<InputGroupText>
							Add ETH
							{/* <img src={inkdropGreen} width="20" height="20" className="drops ml-3" alt="" />*/}
						</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				{/* <div className="drop-message-button float-right" onClick={this.dropMessage}>
                <img src={inkdropGreen} width="20" height="20" className="drops" alt="" />
              </div> */}
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
	onDropsChange: PropTypes.func.isRequired,
	dropMessage: PropTypes.func.isRequired,
	drops: PropTypes.number.isRequired,
}

export default MessageActions
