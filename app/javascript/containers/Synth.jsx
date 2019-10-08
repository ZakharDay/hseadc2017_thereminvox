import _ from 'lodash'
import React from 'react'
import Tone from 'tone'

import * as effects from '../tunes/effects'
import * as parts from '../tunes/parts'
import * as synths from '../tunes/synths'

import PlaySwitch from '../components/PlaySwitch'
import AutoFilter from '../components/effects/AutoFilter'
import Chorus from '../components/effects/Chorus'
import Distortion from '../components/effects/Distortion'
import FeedbackDelay from '../components/effects/FeedbackDelay'
import Freeverb from '../components/effects/Freeverb'

import ToneSynth from '../components/ToneSynth'
import NoiseSynth, { instrument as noiseSynth } from '../components/NoiseSynth'
import PolySynth, { polySynth } from '../components/PolySynth'

export default class Synth extends React.Component {
  constructor(props) {
    super(props)

    const defaultWetValue = 0.8

    let ambientSynth = synths.toneSynth()
    let ambientAutoFilter = effects.autoFilter()
    let ambientChorus = effects.chorus()
    let ambientDistortion = effects.distortion()
    let ambientFeedbackDelay = effects.feedbackDelay()
    let ambientFreeverb = effects.freeverb()

    let leadSynth = synths.polySynth()
    let leadDistortion = effects.distortion()

    let loop1 = new Tone.Loop(function(time) {
      ambientSynth.triggerAttackRelease('C2', '8n', time)
    }, '4n')

    let loop3 = new Tone.Loop(function(time) {
      leadSynth.triggerAttackRelease('C4', '1m', time)
    }, '1m')

    ambientSynth.chain(
      ambientAutoFilter,
      ambientChorus,
      ambientDistortion,
      ambientFeedbackDelay,
      ambientFreeverb,
      Tone.Master
    )

    leadSynth.chain(leadDistortion, Tone.Master)

    this.state = {
      ambientSynth,
      ambientAutoFilter: {
        name: 'ambientAutoFilter',
        effect: ambientAutoFilter,
        wet: defaultWetValue,
        on: false
      },
      ambientChorus: {
        name: 'ambientChorus',
        effect: ambientChorus,
        wet: defaultWetValue,
        on: false
      },
      ambientDistortion: {
        name: 'ambientDistortion',
        effect: ambientDistortion,
        wet: defaultWetValue,
        on: false
      },
      ambientFeedbackDelay: {
        name: 'ambientFeedbackDelay',
        effect: ambientFeedbackDelay,
        wet: defaultWetValue,
        on: false
      },
      ambientFreeverb: {
        name: 'ambientFreeverb',
        effect: ambientFreeverb,
        wet: defaultWetValue,
        on: false
      },
      leadSynth,
      leadDistortion: {
        name: 'leadDistortion',
        effect: leadDistortion,
        wet: defaultWetValue,
        on: false
      },
      loop1: {
        loop: loop1,
        on: false
      },
      loop3: {
        loop: loop3,
        on: false
      },
      part1: {
        part: parts.part1(leadSynth),
        on: false
      },
      lastChange: Date.now(),
      timeout: 100
    }

    _.bindAll(
      this,
      // 'getRandomArbitrary',
      // 'generateRandom',
      'toggleLoop',
      'togglePart',
      'changeSynthValue',
      'toggleEffect',
      'changeEffectWetValue',
      'changeEffectValue',
      'changeEffectFilterValue'
    )

    Tone.Transport.bpm.value = 130
    // Tone.Transport.bpm.value = 30
    Tone.Transport.start()
  }

  // componentDidMount() {
  //   this.generateRandom()
  // }

  // getRandomArbitrary(min, max) {
  //   return Math.floor(Math.random() * (max - min)) + min
  // }

  // generateRandom() {
  //   const { lastChange, timeout } = this.state
  //
  //   if (Date.now() - lastChange >= timeout) {
  //     const random = this.getRandomArbitrary(100, 3000)
  //
  //     this.setState({
  //       lastChange: Date.now(),
  //       timeout: random
  //     })
  //
  //     this.changeDistortionValue('distortion', random / 30)
  //   }
  //
  //   setTimeout(() => this.generateRandom(), timeout)
  // }

  toggleLoop(loopName) {
    let { loop, on } = this.state[loopName]

    on == true ? loop.stop() : loop.start('0m')

    this.setState({
      [`${loopName}`]: {
        loop: loop,
        on: !on
      }
    })
  }

  togglePart(partName) {
    let { part, on } = this.state[partName]

    if (on == true) {
      part.stop()
    } else {
      part.start(0)
      part.loop = true
      part.loopEnd = '8m'
    }

    this.setState({
      [`${partName}`]: {
        part: part,
        on: !on
      }
    })
  }

  changeSynthValue(synthName, effectName, value) {
    let synth = this.state[synthName]
    let envelope = synth.instrument.envelope
    envelope[effectName] = value

    this.setState({
      [`${effectName}`]: {
        oscillator: synth.instrument.oscillator,
        envelope: envelope
      }
    })
  }

  toggleEffect(effectName) {
    let { name, effect, wet, on } = this.state[effectName]

    effect.wet.value = on == true ? 0 : wet
    on = !on

    this.setState({
      [`${effectName}`]: {
        name,
        effect,
        wet,
        on
      }
    })
  }

  changeEffectWetValue(effectName, effectProperty, value) {
    let { name, effect, wet, on } = this.state[effectName]

    effect[effectProperty].value = on == true ? value : 0
    wet = value

    this.setState({
      [`${effectName}`]: {
        name,
        effect,
        wet,
        on
      }
    })
  }

  changeEffectValue(effectName, effectProperty, value) {
    let { name, effect, wet, on } = this.state[effectName]

    effect[effectProperty] = value

    this.setState({
      [`${effectName}`]: {
        name,
        effect,
        wet,
        on
      }
    })
  }

  changeEffectFilterValue(effectName, filterParamName, value) {
    let { effect, wet, on } = this.state[effectName]

    effect.filter[filterParamName] = value

    this.setState({
      [`${effectName}`]: {
        name,
        effect,
        wet,
        on
      }
    })
  }

  render() {
    let {
      ambientSynth,
      ambientAutoFilter,
      ambientChorus,
      ambientDistortion,
      ambientFeedbackDelay,
      ambientFreeverb,
      leadSynth,
      leadDistortion,
      loop1,
      part1
    } = this.state

    let {
      toggleEffect,
      toggleLoop,
      togglePart,
      changeSynthValue,
      changeEffectWetValue,
      changeEffectValue,
      changeEffectFilterValue
    } = this

    return (
      <div>
        <div className="effectsBoard">
          <ToneSynth
            synth="ambientSynth"
            instrument={ambientSynth}
            on={loop1.on}
            togglePlay={() => toggleLoop('loop1')}
            changeSynthValue={this.changeSynthValue}
          />
          <AutoFilter
            {...ambientAutoFilter}
            toggleEffect={() => toggleEffect('ambientAutoFilter')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
            changeEffectFilterValue={changeEffectFilterValue}
          />
          <Chorus
            {...ambientChorus}
            toggleEffect={() => toggleEffect('ambientChorus')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
          />
          <Distortion
            {...ambientDistortion}
            toggleEffect={() => toggleEffect('ambientDistortion')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
          />
          <FeedbackDelay
            {...ambientFeedbackDelay}
            toggleEffect={() => toggleEffect('ambientFeedbackDelay')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
          />
          <Freeverb
            {...ambientFreeverb}
            toggleEffect={() => toggleEffect('ambientFreeverb')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
          />
        </div>

        <div className="effectsBoard">
          <PolySynth
            synth="leadSynth"
            instrument={ambientSynth}
            on={part1.on}
            togglePlay={() => togglePart('part1')}
            changeSynthValue={changeSynthValue}
          />
          <Distortion
            {...leadDistortion}
            toggleEffect={() => toggleEffect('leadDistortion')}
            changeEffectWetValue={changeEffectWetValue}
            changeEffectValue={changeEffectValue}
          />
        </div>
      </div>
    )
  }
}
