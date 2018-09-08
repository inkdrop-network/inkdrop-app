import React from 'react'
import PropTypes from 'prop-types'
import InputRange from 'react-input-range'
import { roundFloat3 } from '../../../utils/rounder'

import 'react-input-range/lib/css/index.css'
import './customStyles.css'

const InputRangeSlider = ({ minValue, maxValue, value, onChange }) => (
	<div className="d-flex flex-row">
		<div className="flex-grow-1 mr-3">
			<InputRange
				name="input-range-slider"
				minValue={minValue}
				maxValue={maxValue}
				value={value}
				step={0.001}
				onChange={onChange}
				formatLabel={() => ''}
			/>
		</div>
		<div className="text-right" style={{ width: '90px' }}>
			{roundFloat3(value)} ETH
		</div>
	</div>
)

InputRangeSlider.propTypes = {
	minValue: PropTypes.number.isRequired,
	maxValue: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default InputRangeSlider
