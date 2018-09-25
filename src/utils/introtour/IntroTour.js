import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

class IntroTour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steps: [
        {
          target: '#post-message',
          title: 'Share Something Valuable',
          content:
            'Drop your first post. Share something valuable with the Ethereum community. Attach some ETH to it to give it an initial boost.',
          disableBeacon: true,
          placement: 'right',
        },
        {
          target: '.newsfeed:first-child .grid-item',
          title: 'Crypto-Likes',
          content: `Appreciate content and support creators. Crypto-likes give posts a little boost and the awarded ETH will be donated to the author. 
            Simply click on the ETH symbol and choose the amount you want to attach.`,
          disableBeacon: true,
          placement: 'right',
        },
        {
          target: '#profile-header',
          title: 'Withdraw Your Earned ETHs',
          content:
            'See what you earned on InkDrop and withdraw it to your personal ETH wallet with one click.',
          disableBeacon: true,
          placement: 'bottom',
        },
      ],
    }

    this.callback = this.callback.bind(this)
  }

  componentDidMount() {
    this.setState({ run: this.props.showTour })
  }

  callback(data) {
    // const { action, index, type } = data
  }

  render() {
    const defaultOptions = {
      arrowColor: '#f1f1f1',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: '#85bd3e',
      spotlightShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.1)',
      textColor: '#29313e',
    }
    return (
      <Joyride
        steps={this.state.steps}
        run={this.props.showTour}
        callback={this.callback}
        continuous={true}
        showProgress={true}
        spotlightPadding={2}
        styles={{ options: defaultOptions }}
      />
    )
  }
}

IntroTour.propTypes = {
  showTour: PropTypes.bool.isRequired,
}

const mapStateToProps = state => {
  return {
    showTour: state.user.showTour,
  }
}

export default connect(mapStateToProps)(IntroTour)
