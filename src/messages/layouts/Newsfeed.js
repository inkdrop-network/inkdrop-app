import React, { Component } from 'react'
import IntroTour from '../../utils/IntroTour.js'
import MessageListMasonryContainer from '../components/messagelist/MessageListMasonryContainer'

class Newsfeed extends Component {
	render() {
		return (
			<React.Fragment>
				<MessageListMasonryContainer />
				<IntroTour />
			</React.Fragment>
		)
	}
}

export default Newsfeed
