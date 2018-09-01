import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { CardColumns, Button } from 'reactstrap'
import InfiniteScroll from 'react-infinite-scroller'
import FlipMove from 'react-flip-move'
// import MasonryInfiniteScroller from 'react-masonry-infinite'
// import Masonry from 'react-masonry-component'

import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageList extends PureComponent {
  constructor(props) {
    super(props)

    this.masonryOptions = {
      itemSelector: '.grid-item', // use a separate class for itemSelector, other than .col-
      columnWidth: '.grid-sizer',
      percentPosition: true,
    }

    this.loadMore = this.loadMore.bind(this)
    this.sortNewsfeed = this.sortNewsfeed.bind(this)
  }

  loadMore() {
    // this.props.fetchMessages(this.props.pagination.items)
  }

  componentDidMount() {
    this.props.fetchMessages(this.props.pagination.items)
  }

  sortNewsfeed() {
    this.props.sortNewsfeed()
  }

  render() {
    const loader = (
      <div className="text-center" key={-1}>
        <img src={loadingSpinner} alt="loading" width="20" height="20" />
      </div>
    )

    let items = this.props.messages
    // sort messages descending according to their drops
    // let items = this.props.messages.sort(function(msgA, msgB) {
    //   return msgB.drops - msgA.drops
    // })
    // let childElements = this.props.messages.map(msg => (
    //   <div className="grid-item col-3" key={msg.id}>
    //     {msg.content}
    //   </div>
    // ))

    // TODO: Show loader in the beginning and enable FlipMove only once the first posts are fetched and the array is sorted
    return (
      <InfiniteScroll
        pageStart={0}
        threshold={1}
        initialLoad={true}
        loadMore={this.loadMore}
        hasMore={this.props.pagination.hasMore}
        loader={loader}>
        <Button size="sm" color="secondary" className="mb-4 ml-auto" onClick={this.sortNewsfeed}>
          Sort
        </Button>
        <CardColumns>
          <FlipMove
            disableAllAnimations={true} //this.props.messages.length <= 0}
            appearAnimation="none"
            enterAnimation="none"
            leaveAnimation="none"
            duration={750}
            staggerDurationBy={30}>
            {items.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
          </FlipMove>
        </CardColumns>
      </InfiniteScroll>
      /*<MasonryInfiniteScroller
        className="messages"
        sizes={this.props.sizes}
        position={false}
        initialLoad={false}
        loadMore={() => console.log(1)}
        hasMore={false}
        loader={loader}>
        {items.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
      </MasonryInfiniteScroller>*/
      /*<Masonry className="grid" options={this.masonryOptions}>
        <div className="grid-sizer col-3" />
        {childElements}
      </Masonry>*/
      /*<CardColumns>
        {items.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
      </CardColumns>*/
    )
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  pagination: PropTypes.object,
  fetchMessages: PropTypes.func,
  sortNewsfeed: PropTypes.func,
}

export default MessageList
