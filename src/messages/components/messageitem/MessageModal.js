import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SVG from 'react-inlinesvg'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import MessageHeader from './components/MessageHeader'
import MessageActionsExtend from './components/MessageActionsExtend'
import CommentList from '../commentlist/CommentList'

import iconComments from '../../../../public/icons/icon-comments.svg'
import iconReport from '../../../../public/icons/icon-report.svg'
import iconEther from '../../../../public/icons/icon-ether.svg'

class MessageModal extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			showActions: false,
		}

		this.toggleActions = this.toggleActions.bind(this)
	}

	toggleActions() {
		this.setState(prevState => {
			return { showActions: !prevState.showActions }
		})
	}

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="lg" className="">
				<ModalBody>
					<MessageHeader msg={this.props.msg} extended={true} />
				</ModalBody>
				<ModalBody>{this.props.msg.content}</ModalBody>
				<ModalBody>
					<hr className="m-0 mb-3" />
					<div className="container-fluid">
						<div className="row">
							<div className="col icon-actions text-left" onClick={this.toggleActions}>
								<SVG
									src={iconEther}
									wrapper={React.createFactory('div')}
									className="icon d-inline"
								/>
								<div className="icon-number d-inline ml-1">
									{Number(this.props.msg.drops).toFixed(3)}
								</div>
							</div>

							<div className="col icon-actions text-center" onClick={this.props.toggleComments}>
								<SVG
									src={iconComments}
									wrapper={React.createFactory('div')}
									className="icon d-inline"
								/>
								<div className="icon-number d-inline ml-1">{this.props.msg.commentIds.length}</div>
							</div>

							<div className="col icon-actions text-right">
								<SVG
									src={iconReport}
									wrapper={React.createFactory('div')}
									className="icon d-inline"
								/>
								<div className="icon-number d-inline ml-1">Report Post</div>
							</div>
						</div>
					</div>
				</ModalBody>
				{this.state.showActions && (
					<MessageActionsExtend
						maxValue={this.props.maxValue}
						value={this.props.value}
						onDropsChange={this.props.onDropsChange}
						dropMessage={this.props.dropMessage}
					/>
				)}

				{this.props.showComments && (
					<ModalFooter>
						{this.props.msg.fromBlockchain && <CommentList message={this.props.msg} />}
					</ModalFooter>
				)}
			</Modal>
		)
	}
}

MessageModal.propTypes = {
	msg: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	maxValue: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	onDropsChange: PropTypes.func.isRequired,
	dropMessage: PropTypes.func.isRequired,
	showComments: PropTypes.bool.isRequired,
	toggleComments: PropTypes.func.isRequired,
}

export default MessageModal
