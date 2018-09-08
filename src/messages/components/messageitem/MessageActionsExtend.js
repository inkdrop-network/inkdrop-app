import React from 'react'
import PropTypes from 'prop-types'
import { CardBody, Button } from 'reactstrap'
import { roundFloat3 } from '../../../utils/rounder'
import InputRangeSlider from '../rangeslider/InputRangeSlider'

const MessageActionsExtend = ({ balance, drops, onDropsChange, web3 }) => (
	<CardBody className="py-2">
		<div className="d-flex flex-row">
			<div className="flex-grow-1 mr-3">
				<InputRangeSlider minValue={0} maxValue={balance} value={drops} onChange={onDropsChange} />
			</div>
			<div className="text-right" style={{ width: '90px' }}>
				{roundFloat3(web3.utils.fromWei(`${drops}`, 'ether'))} ETH
			</div>
		</div>
		<Button color="green" className="my-3" block>
			Upvote
		</Button>
	</CardBody>
)

MessageActionsExtend.propTypes = {
	balance: PropTypes.number.isRequired,
	drops: PropTypes.number.isRequired,
	onDropsChange: PropTypes.func.isRequired,
}

export default MessageActionsExtend
