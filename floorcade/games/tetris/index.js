const R = require('ramda');
const most = require('most');

const {
    data: {
      engine: EngineData,
      input: InputData
    },
    input: {
        utils: {
            keyStore: KeyStore,
            keyMapper: KeyMapper
        }
    },
    engine: Engine
} = require('intris');

const gamepad = require('../../input/gamepad');

module.exports = class Game {
  constructor(player, ticker, randomSeed, external) {
    const input =
        gamepad
            .filter(({ id }) => id === player)
            .thru(KeyMapper(most.just(InputData.methods.gamepad)))
            .thru(KeyStore(InputData.keys));
    const config = most.just(EngineData.config);
    this.stream =
      ticker
        .thru(Engine({ config, input, external, randomSeed }));
  }
  run(handler) {
    return new Promise((resolve, reject) => {
      this.subscription =
        this.stream
          .subscribe({
            next: handler,
            complete: resolve,
            error: reject,
          });
    });
  }
  destroy() {
    this.subscription.unsubscribe();
  }
}