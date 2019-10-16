import _ from 'lodash'
import React from 'react'
import Tone from 'tone'

import ToggleSwitch from '../controls/ToggleSwitch'
import Slider from '../controls/Slider'

// {
//   pitchDecay : 0.05 ,
//   octaves : 10 ,
//   oscillator : {
//     type : 'sine'
//   } ,
//   envelope : {
//     attack : 0.001 ,
//     decay : 0.4 ,
//     sustain : 0.01 ,
//     release : 1.4 ,
//     attackCurve : 'exponential'
//   }
// }

export default class ToneSynth extends React.Component {
  constructor(props) {
    super(props)
    _.bindAll(this, 'handleValueChange')
  }

  handleValueChange(name, property, value) {
    const { changeSynthValue } = this.props
    changeSynthValue(name, property, value)
  }

  render() {
    const { synth, instrument, on, togglePlay } = this.props
    const { attack, decay, sustain, release } = instrument.envelope

    return (
      <div className="Effect">
        <ToggleSwitch value="Synth" current={on} handleClick={togglePlay} />

        <div className="controlsContainer">
          <div className="controlsRow">
            <h2>Attack</h2>
            <Slider
              name={synth}
              property="attack"
              min="0"
              max="1"
              value={attack}
              handleValueChange={this.handleValueChange}
            />

            <h2>Decay</h2>
            <Slider
              name={synth}
              property="decay"
              min="0"
              max="1"
              value={decay}
              handleValueChange={this.handleValueChange}
            />

            <h2>Sustain</h2>
            <Slider
              name={synth}
              property="sustain"
              min="0"
              max="1"
              value={sustain}
              handleValueChange={this.handleValueChange}
            />

            <h2>Release</h2>
            <Slider
              name={synth}
              property="release"
              min="0"
              max="2"
              value={release}
              handleValueChange={this.handleValueChange}
            />
          </div>
        </div>
      </div>
    )
  }
}
