import React, { Component } from 'react'
import Masonry from 'react-masonry-component'

var MasonryR = require('masonry-layout')

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
				// columnWidth: 270,
				transitionDuration: 0,
				columnWidth: '.grid-sizer',
				itemSelector: '.grid-item',
				// gutter: 10,
				percentPosition: true,
			},
		}
	}

	componentDidMount() {
		var msnry = new MasonryR('.grid', this.state.masonryOptions)
	}

	render() {
		let items = this.state.messages.map(msg => (
			<div
				key={msg.id}
				className="card grid-item mb-2"
				style={{ height: `${msg.height}px`, width: '270px' }}>
				<h2>{msg.content}</h2>
			</div>
		))

		/* <Masonry
						className={'my-gallery-class'} // default ''
						elementType={'div'} // default 'div'
						options={this.state.masonryOptions} // default {}
						disableImagesLoaded={false} // default false
						updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
						imagesLoadedOptions={''} // default {}
					>
						<div class="grid-sizer" />
						{items}
					</Masonry>
					*/

		return (
			<div className="container">
				<div className="row" />
				<div class="grid my-4">
					<div class="grid-sizer col-12 col-md-4 col-lg-3" />
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '250px' }}>
						#1
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '100px' }}>
						#2
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '200px' }}>
						#3
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '150px' }}>
						#4
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '250px' }}>
						#5
					</div>
					<div
						class="card grid-item col-12 col-md-4 col-lg-3 mb-2"
						mb-2
						style={{ height: '200px' }}>
						#6
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '250px' }}>
						#7
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '200px' }}>
						#8
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '200px' }}>
						#9
					</div>
					<div class="card grid-item col-12 col-md-4 col-lg-3 mb-2" style={{ height: '200px' }}>
						#10
					</div>
				</div>
			</div>
		)
	}
}

export default NewsfeedMasonry
