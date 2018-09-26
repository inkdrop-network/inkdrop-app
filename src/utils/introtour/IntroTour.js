import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'
import { EVENTS } from 'react-joyride/es/constants'
import { USER_TOUR } from '../../user/userReducer'

class IntroTour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locale: { back: 'Back', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip' },
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

  // componentDidMount() {
  //   this.setState({ run: this.props.showTour })
  // }

  callback(data) {
    const { type } = data

    if (type === EVENTS.TOUR_END) {
      this.props.resetIntroTour()
    }
  }

  render() {
    if (this.props.showTour) {
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
          locale={this.state.locale}
          styles={{ options: defaultOptions }}
        />
      )
    }
    return null
  }
}

IntroTour.propTypes = {
  showTour: PropTypes.bool.isRequired,
  resetIntroTour: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    showTour: state.user.showTour,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetIntroTour: () => {
      dispatch({ type: USER_TOUR, payload: false })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroTour)
