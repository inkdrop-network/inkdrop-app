import React, { Component } from 'react'
import Masonry from 'react-masonry-component'

import MessageFormContainer from '../components/messageform/MessageFormContainer'
import loadingSpinner from '../../../public/icons/loading-spinner.svg'

class NewsfeedMasonry extends Component {
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
	}

	render() {
		const loader = (
			<div className="text-center" key={-1}>
				<img src={loadingSpinner} alt="loading" width="20" height="20" />
			</div>
		)

		let items = this.state.messages.map(msg => (
			<div key={msg.id} className="grid-item col-12 col-md-4 col-lg-3 mb-3 px-2">
				<div className="card" style={{ height: `${msg.height}px` }}>
					<h2>{msg.content}</h2>
				</div>
			</div>
		))

		items.unshift(
			<div key={-1} className="grid-stamp col-12 col-md-4 col-lg-3 mb-3 px-2">
				<MessageFormContainer />
			</div>
		)

		return (
			<div className="container my-4">
				<Masonry className={'newsfeed'} options={this.state.masonryOptions}>
					<div className="grid-sizer col-12 col-md-4 col-lg-3" />
					{items}
				</Masonry>
			</div>
		)
	}
}

export default NewsfeedMasonry
