import React from 'react'
import PropTypes from 'prop-types'
import { CardBody, Button } from 'reactstrap'
import InputRangeSlider from '../rangeslider/InputRangeSlider'

const MessageActionsExtend = ({
	className,
	minValue,
	maxValue,
	value,
	onDropsChange,
	dropMessage,
	web3,
}) => (
	<CardBody className={`pt-0 ${className}`}>
		<hr className="m-0 mb-4" />

		<InputRangeSlider
			minValue={minValue}
			maxValue={maxValue}
			value={value}
			onChange={onDropsChange}
		/>
		<Button color="green" className="mt-3" block onClick={dropMessage}>
			Upvote
		</Button>
	</CardBody>
)

MessageActionsExtend.propTypes = {
	className: PropTypes.string.isRequired,
	minValue: PropTypes.number.isRequired,
	maxValue: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	onDropsChange: PropTypes.func.isRequired,
	dropMessage: PropTypes.func.isRequired,
}

export default MessageActionsExtend
