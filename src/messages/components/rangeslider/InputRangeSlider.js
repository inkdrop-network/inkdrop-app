import React from 'react'
import PropTypes from 'prop-types'
import SVG from 'react-inlinesvg'
import InputRange from 'react-input-range'
import { roundFloat3 } from '../../../utils/rounder'

import iconEther from '../../../icons/icon-ether.svg'
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
				step={Number(process.env.REACT_APP_MIN_DROP)}
				onChange={onChange}
				formatLabel={() => ''}
			/>
		</div>
		<div className="slider-value text-right" style={{ width: '90px' }}>
			{Number(roundFloat3(value)).toFixed(3)}{' '}
			<SVG src={iconEther} wrapper={React.createFactory('div')} className="icon d-inline" />
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
