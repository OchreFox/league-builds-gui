import React from 'react'

import { Container, Stage } from 'react-pixi-fiber'

import RiotMagicEmitter from '@/components/ChampionPicker/RiotMagicEmitter'

const riotMagicEmitterConfig = {
  alpha: {
    start: 1,
    end: 0,
  },
  scale: {
    start: 0.15,
    end: 0.06,
    minimumScaleMultiplier: 0.5,
  },
  color: {
    start: '#7fddfa',
    end: '#4e84e6',
  },
  speed: {
    start: 30,
    end: 1,
    minimumSpeedMultiplier: 1,
  },
  acceleration: {
    x: 0,
    y: -20,
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 360,
  },
  noRotation: false,
  rotationSpeed: {
    min: 10,
    max: 500,
  },
  lifetime: {
    min: 0.5,
    max: 2.5,
  },
  blendMode: 'screen',
  frequency: 0.001,
  emitterLifetime: -1,
  maxParticles: 500,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: false,
  spawnType: 'rect',
  spawnRect: {
    x: 0,
    y: 0,
    w: 2000,
    h: 30,
  },
}

const RiotMagicParticles = ({ width = 150, height = 150 }: { width: number; height: number }) => {
  return (
    <Stage
      className="pointer-events-none absolute left-0 top-0"
      options={{
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        width: width,
        height: height,
      }}
    >
      <Container>
        <RiotMagicEmitter
          images={[
            'https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/effects/particle.png',
          ]}
          config={{
            ...riotMagicEmitterConfig,
            pos: {
              x: 0,
              y: height,
            },
          }}
        />
      </Container>
    </Stage>
  )
}

export default RiotMagicParticles
