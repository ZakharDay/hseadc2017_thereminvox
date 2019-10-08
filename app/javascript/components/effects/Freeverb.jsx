import React from 'react'

import PlaySwitch from '../PlaySwitch'
import ToggleSwitch from '../ToggleSwitch'
import Slider from '../Slider'
import Knob from '../Knob'
import ButtonSet from '../ButtonSet'

export default class Freeverb extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const set = ['sine', 'square', 'triangle', 'sawtooth']

    const {
      name,
      effect,
      wet,
      on,
      toggleEffect,
      changeEffectWetValue,
      changeEffectValue
    } = this.props

    return (
      <div className="Effect">
        <ToggleSwitch
          value="Freeverb"
          current={on}
          handleClick={toggleEffect}
        />

        <div className="controlsContainer">
          <div className="controlsRow">
            <h2>Wet</h2>
            <Slider
              name={name}
              property="wet"
              min="0"
              max="1"
              value={wet}
              handleValueChange={changeEffectWetValue}
            />

            <h2>Room Size</h2>
            <Slider
              name={name}
              property="frequency.value"
              min="0"
              max="1"
              value={effect.roomSize}
              handleValueChange={changeEffectValue}
            />

            <h2>Dampening</h2>
            <Slider
              name={name}
              property="dampening.value"
              min="0"
              max="5000"
              on={on}
              value={effect.dampening.value}
              handleValueChange={changeEffectValue}
            />
          </div>
        </div>
      </div>
    )
  }
}
