import React from 'react'
import PropTypes from 'prop-types'
import { CardBody, Button } from 'reactstrap'
import InputRangeSlider from '../../rangeslider/InputRangeSlider'

const MessageActionsExtend = ({ maxValue, value, onDropsChange, dropMessage }) => (
	<CardBody className={`pt-0`}>
		<hr className="m-0 mb-4" />

		<InputRangeSlider minValue={0.001} maxValue={maxValue} value={value} onChange={onDropsChange} />
		<Button color="green" className="mt-3" block onClick={dropMessage}>
			Upvote
		</Button>
	</CardBody>
)

MessageActionsExtend.propTypes = {
	maxValue: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	onDropsChange: PropTypes.func.isRequired,
	dropMessage: PropTypes.func.isRequired,
}

export default MessageActionsExtend
