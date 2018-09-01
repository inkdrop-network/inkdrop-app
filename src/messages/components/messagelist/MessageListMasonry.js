import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Masonry from 'react-masonry-component'
import InfiniteScroll from 'react-infinite-scroller'
import MessageFormContainer from '../messageform/MessageFormContainer'
import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageListMasonry extends Component {
	constructor(props) {
		super(props)

		this.state = {
			masonryOptions: {
				transitionDuration: 0,
				horizontalOrder: false,
				columnWidth: '.grid-sizer',
				itemSelector: '.grid-item',
				// stamp elements
				stamp: '.grid-stamp',
				percentPosition: true,
			},
		}

		this.loadMore = this.loadMore.bind(this)
	}

	loadMore() {
		this.props.fetchMessages(this.props.pagination.items)
	}

	render() {
		const loader = (
			<div className="text-center" key={-1}>
				<img src={loadingSpinner} alt="loading" width="20" height="20" />
			</div>
		)

		let items = this.props.messages.map(msg => (
			<div key={msg.id} className="grid-item col-12 col-md-4 col-lg-3 mb-3 px-2">
				<MessageItemContainer message={msg} />
			</div>
		))

		// add message for to the first position of the array
		items.unshift(
			<div key={-1} className="grid-stamp col-12 col-md-4 col-lg-3 mb-3 px-2">
				<MessageFormContainer />
			</div>
		)

		return (
			<div className="container my-4">
				<InfiniteScroll
					pageStart={0}
					threshold={1}
					initialLoad={true}
					loadMore={this.loadMore}
					hasMore={this.props.pagination.hasMore}
					loader={loader}>
					<Masonry className={'newsfeed'} options={this.state.masonryOptions}>
						<div className="grid-sizer col-12 col-md-4 col-lg-3" />
						{items}
					</Masonry>
				</InfiniteScroll>
			</div>
		)
	}
}

MessageListMasonry.propTypes = {
	messages: PropTypes.array,
	pagination: PropTypes.object,
	fetchMessages: PropTypes.func,
	sortNewsfeed: PropTypes.func,
}

export default MessageListMasonry
