import React from 'react'
import PropTypes from 'prop-types'
import { CardBody } from 'reactstrap'
import { roundFloat3 } from '../../../utils/rounder'
import InputRangeSlider from '../rangeslider/InputRangeSlider'

const MessageActionsExtend = ({ balance, drops, onDropsChange }) => (
	<CardBody className="py-2">
		<InputRangeSlider minValue={0} maxValue={balance} value={drops} onChange={onDropsChange} />
		<div>{roundFloat3(drops)}</div>
	</CardBody>
)

MessageActionsExtend.propTypes = {
	balance: PropTypes.number.isRequired,
	drops: PropTypes.number.isRequired,
	onDropsChange: PropTypes.func.isRequired,
}

export default MessageActionsExtend
