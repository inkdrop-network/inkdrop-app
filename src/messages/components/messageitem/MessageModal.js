import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import MessageHeader from './components/MessageHeader'
import CommentList from '../commentlist/CommentList'

const MessageModal = ({ msg, isOpen, toggle }) => (
	<Modal isOpen={isOpen} toggle={toggle} size="lg" className="">
		<ModalBody>
			<MessageHeader msg={msg} />
		</ModalBody>
		<ModalBody>{msg.content}</ModalBody>
		<ModalBody>
			<hr className="m-0 mb-4" />
			message actions come in here
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
