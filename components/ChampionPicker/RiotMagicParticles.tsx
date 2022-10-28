import React from 'react'
import { Container, Stage } from 'react-pixi-fiber'

import RiotMagicEmitter from './RiotMagicEmitter'

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
    y: -50,
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
  // Monitor if the container gets new children

  return (
    <Stage
      className="absolute top-0 left-0 pointer-events-none"
      options={{
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        width: width,
        height: height,
      }}
    >
      <Container>
        <RiotMagicEmitter
          images={['/effects/particle.png']}
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