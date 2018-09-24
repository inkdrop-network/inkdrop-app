import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

class IntroTour extends PureComponent {
  state = {
    run: false,
    steps: [
      {
        target: '.my-first-step',
        content: 'This if my awesome feature!',
        placement: 'bottom',
      },
      {
        target: '.my-other-step',
        content: 'This if my awesome feature!',
        placement: 'bottom',
      },
    ],
  }

  componentDidMount() {
    this.setState({ run: true }) // this.props.showTour
  }

  callback = data => {
    const { action, index, type } = data
  }

  render() {
    const { steps, run } = this.state

    return <Joyride steps={steps} run={run} callback={this.callback} />
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
