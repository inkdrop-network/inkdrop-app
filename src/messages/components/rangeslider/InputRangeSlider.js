import React from 'react'
import PropTypes from 'prop-types'

import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import './customStyles.css'

const InputRangeSlider = ({ minValue, maxValue, value, onChange }) => (
	<InputRange
		name="input-range-slider"
		minValue={minValue}
		maxValue={maxValue}
		value={value}
		step={1000000000000000}
		onChange={onChange}
		formatLabel={() => ''}
	/>
)

InputRangeSlider.propTypes = {
	minValue: PropTypes.number.isRequired,
	minValue: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default InputRangeSlider
