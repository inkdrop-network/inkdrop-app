import React, { Component } from 'react'
import Masonry from 'react-masonry-infinite'

import MessageFormContainer from '../components/messageform/MessageFormContainer'
import loadingSpinner from '../../../public/icons/loading-spinner.svg'

class NewsfeedBricks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [
        {
          id: '4',
          height: 150,
          content: '#1',
          username: 'shobi',
          timestamp: '2018-08-31T15:47:02.000Z',
          timetolive: '2018-08-31T15:47:02.000Z',
          likes: 0,
          drops: 0.454,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '3',
          height: 300,
          content: '#2',
          username: 'shobi',
          timestamp: '2018-08-31T15:46:39.000Z',
          timetolive: '2018-08-31T15:46:39.000Z',
          likes: 0,
          drops: 0,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '2',
          content: '#3',
          height: 200,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '1',
          content: '#4',
          height: 400,
          username: 'mikas',
          timestamp: '2018-08-30T21:38:20.000Z',
          timetolive: '2018-08-30T21:38:20.000Z',
          likes: 0,
          drops: 0.15,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmdJREFt3moBxBcNENsgkZcJGUH5UASSx7TZnrseKHbWby',
          userAdr: '0xa84C544207Da6Df37bb64517fF452d0315450266',
          commentIds: [1, 2],
          comments: [
            {
              id: 1,
              content: '#2.2',
              username: 'mikas',
              timestamp: '2018-08-30T21:38:39.000Z',
              timetolive: '1970-01-01T00:00:00.000Z',
              likes: 0,
              drops: 0,
              userUrl:
                'https://gateway.ipfs.io/ipfs/QmdJREFt3moBxBcNENsgkZcJGUH5UASSx7TZnrseKHbWby',
              userAdr: '0xa84C544207Da6Df37bb64517fF452d0315450266',
              fromBlockchain: true,
              initialized: false,
            },
            {
              id: 2,
              content: '#1.3',
              username: 'shobi',
              timestamp: '2018-08-30T21:40:01.000Z',
              timetolive: '1970-01-01T00:00:00.000Z',
              likes: 0,
              drops: 0,
              userUrl:
                'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
              userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
              fromBlockchain: true,
              initialized: false,
            },
          ],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '0',
          height: 150,
          content: '#5',
          username: 'mikas',
          timestamp: '2018-08-30T21:38:20.000Z',
          timetolive: '2018-08-30T21:38:20.000Z',
          likes: 0,
          drops: 0.1,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmdJREFt3moBxBcNENsgkZcJGUH5UASSx7TZnrseKHbWby',
          userAdr: '0xa84C544207Da6Df37bb64517fF452d0315450266',
          commentIds: [0, 3],
          comments: [
            {
              id: 0,
              content: '#1.1',
              username: 'mikas',
              timestamp: '2018-08-30T21:38:38.000Z',
              timetolive: '1970-01-01T00:00:00.000Z',
              likes: 0,
              drops: 0,
              userUrl:
                'https://gateway.ipfs.io/ipfs/QmdJREFt3moBxBcNENsgkZcJGUH5UASSx7TZnrseKHbWby',
              userAdr: '0xa84C544207Da6Df37bb64517fF452d0315450266',
              fromBlockchain: true,
              initialized: false,
            },
            {
              id: 3,
              content: '#2.1',
              username: 'shobi',
              timestamp: '2018-08-30T21:40:24.000Z',
              timetolive: '1970-01-01T00:00:00.000Z',
              likes: 0,
              drops: 0,
              userUrl:
                'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
              userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
              fromBlockchain: true,
              initialized: false,
            },
          ],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '6',
          content: '#6',
          height: 200,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '7',
          content: '#7',
          height: 200,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '8',
          content: '#8',
          height: 200,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '9',
          content: '#9',
          height: 200,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
        {
          id: '10',
          content: '#10',
          height: 150,
          username: 'shobi',
          timestamp: '2018-08-30T21:40:04.000Z',
          timetolive: '2018-08-30T21:40:04.000Z',
          likes: 0,
          drops: 0.4,
          userUrl: 'https://gateway.ipfs.io/ipfs/QmNcLxJkb7FX9jaK9taqUXPeJQUSWNDL48Q9cEfYv2tNLG',
          userAdr: '0x901061506B6ee640Df725a1DEdB2C4B4A30DdE81',
          commentIds: [],
          comments: [],
          fromBlockchain: true,
          initialized: false,
        },
      ],
      hasMore: true,
      sizes: [
        { columns: 1, gutter: 20 },
        { mq: '768px', columns: 3, gutter: 20 },
        { mq: '992px', columns: 4, gutter: 20 },
      ],
    }
  }

  loadMore() {
    console.log('more')
  }

  render() {
    const loader = (
      <div className="text-center" key={-1}>
        <img src={loadingSpinner} alt="loading" width="20" height="20" />
      </div>
    )
    return (
      <main className="container my-4">
        <div className="row">
          <Masonry
            id="newsfeed-masonry"
            pack={false}
            position={false}
            sizes={this.state.sizes}
            hasMore={this.state.hasMore}
            loader={loader}
            loadMore={this.loadMore}>
            {this.state.messages.map(msg => (
              <div
                key={msg.id}
                className="card"
                style={{ height: `${msg.height}px`, width: '270px', display: 'block' }}>
                <h2>{msg.content}</h2>
              </div>
            ))}
          </Masonry>
        </div>
      </main>
    )
  }
}

export default NewsfeedBricks
