import React from 'react'
import PropTypes from 'prop-types'
import SVG from 'react-inlinesvg'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import MessageHeader from './components/MessageHeader'
import CommentList from '../commentlist/CommentList'

import iconComments from '../../../../public/icons/icon-comments.svg'
import iconReport from '../../../../public/icons/icon-report.svg'
import iconEther from '../../../../public/icons/icon-ether.svg'

const MessageModal = ({ msg, isOpen, toggle }) => (
	<Modal isOpen={isOpen} toggle={toggle} size="lg" className="">
		<ModalBody>
			<MessageHeader msg={msg} extended={true} />
		</ModalBody>
		<ModalBody>{msg.content}</ModalBody>
		<ModalBody>
			<hr className="m-0 mb-3" />
			<div className="container-fluid">
				<div className="row">
					<div className="col icon-actions text-left">
						<SVG src={iconEther} wrapper={React.createFactory('div')} className="icon d-inline" />
						<div className="icon-number d-inline ml-1">{msg.drops}</div>
					</div>

					<div className="col icon-actions text-center">
						<SVG
							src={iconComments}
							wrapper={React.createFactory('div')}
							className="icon d-inline"
						/>
						<div className="icon-number d-inline ml-1">{msg.commentIds.length}</div>
					</div>

					<div className="col icon-actions text-right">
						<SVG src={iconReport} wrapper={React.createFactory('div')} className="icon d-inline" />
						<div className="icon-number d-inline ml-1">Report Post</div>
					</div>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>{msg.fromBlockchain && <CommentList message={msg} />}</ModalFooter>
	</Modal>
)

MessageModal.propTypes = {
	msg: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
}

export default MessageModal
