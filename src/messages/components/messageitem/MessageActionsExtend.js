import React from 'react'
import PropTypes from 'prop-types'
import { CardBody, Button } from 'reactstrap'
import { roundFloat3 } from '../../../utils/rounder'
import InputRangeSlider from '../rangeslider/InputRangeSlider'

const MessageActionsExtend = ({ className, minValue, maxValue, value, onDropsChange, web3 }) => (
	<CardBody className={`pt-0 ${className}`}>
		<hr className="m-0" />
		<div className="d-flex flex-row mt-4">
			<div className="flex-grow-1 mr-3">
				<InputRangeSlider
					minValue={minValue}
					maxValue={maxValue}
					value={value}
					onChange={onDropsChange}
				/>
			</div>
			<div className="text-right" style={{ width: '90px' }}>
				{roundFloat3(web3.utils.fromWei(`${value}`, 'ether'))} ETH
			</div>
		</div>
		<Button color="green" className="mt-3" block>
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
}

export default MessageActionsExtend
