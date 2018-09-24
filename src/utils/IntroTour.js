import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

class IntroTour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      run: true,
      steps: [
        {
          target: '#post-message .message-card',
          title: 'Share Something Valuable',
          content:
            'Drop your first post. Share something valuable with the Ethereum community. Attach some ETH to it to give it an initial boost.',
          disableBeacon: true,
          placement: 'right',
        },
        {
          target: 'body',
          title: 'Crypto-Likes',
          content:
            'Appreciate content and support creators. Crypto-likes give posts a little boost and the awarded ETH will be donated to the author.',
          disableBeacon: true,
          placement: 'bottom',
        },
      ],
    }

    this.callback = this.callback.bind(this)
  }

  componentDidMount() {
    this.setState({ run: true }) // this.props.showTour
  }

  callback(data) {
    // const { action, index, type } = data
  }

  render() {
    console.log(this.state.steps)
    return <Joyride steps={this.state.steps} run={this.state.run} callback={this.callback} />
  }
}

// IntroTour.propTypes = {
//   showTour: PropTypes.bool.isRequired,
// }

// const mapStateToProps = state => {
//   return {
//     showTour: state.user.showTour,
//   }
// }

// export default connect(mapStateToProps)(IntroTour)
export default IntroTour
