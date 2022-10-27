import { Emitter, EmitterConfigV1, upgradeConfig } from '@pixi/particle-emitter'
import * as PIXI from 'pixi.js'
import { CustomPIXIComponent, CustomPIXIComponentBehavior } from 'react-pixi-fiber'

interface EmitterProps {
  image: string
  config: EmitterConfigV1
  [props: string]: any
}

const TYPE = 'ParticleEmitter'

export const behavior: CustomPIXIComponentBehavior<PIXI.Container<PIXI.DisplayObject>, EmitterProps> = {
  customDisplayObject: () => new PIXI.Container(),
  customApplyProps: function (
    instance: PIXI.Container<PIXI.DisplayObject>,
    oldProps: EmitterProps | undefined,
    newProps: EmitterProps
  ) {
    const { image, config } = newProps

    // If there is an emitter, don't create a new one. Very important to avoid memory leaks
    if (instance.children.length > 0) {
      return
    }

    // Create a new config for the EmitterConfigV3 format
    const newConfig = upgradeConfig(config, [PIXI.Texture.from(image)])
    // Create an emitter and add it to the container
    const emitter = new Emitter(instance, newConfig)

    let elapsed = Date.now()

    const tick = () => {
      if (instance.destroyed) {
        return
      }
      requestAnimationFrame(tick)
      const now = Date.now()
      emitter.update((now - elapsed) * 0.001)
      elapsed = now
    }
    // Start emitting
    emitter.emit = true
    // Start the update loop
    tick()
  },
}

export default CustomPIXIComponent(behavior, TYPE)
