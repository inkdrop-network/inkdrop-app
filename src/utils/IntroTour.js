import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

class IntroTour extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      run: true,
      steps: [
        {
          target: 'body',
          content: 'This if my awesome feature!',
          placement: 'bottom',
        },
        {
          target: 'body',
          content: 'This if my awesome feature!',
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
    return <Joyride steps={[]} run={this.state.run} callback={this.callback} />
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
