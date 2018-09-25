import React, { Component } from 'react'
import MessageListMasonryContainer from '../components/messagelist/MessageListMasonryContainer'
import IntroTour from '../../utils/introtour/IntroTour.js'

class Newsfeed extends Component {
	render() {
		return (
			<React.Fragment>
				<IntroTour />
				<MessageListMasonryContainer />
			</React.Fragment>
		)
	}
}

export default Newsfeed
