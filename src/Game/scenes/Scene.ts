import { Direction } from "grid-engine";
import type { GridEngine } from "grid-engine";
import * as Phaser from "phaser";
import { WebsocketBuilder} from 'websocket-ts';
import type { Websocket } from 'websocket-ts';

interface position {
  x: number; 
  y: number;
}

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const API_URL: string = import.meta.env.VITE_API_URL as string;
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};
const playerID = makeid(10);
const players: { [id: string]: position } = {};

export class Scene extends Phaser.Scene {
  private readonly gridEngine!: GridEngine;
  private readonly ws!: Websocket;

  constructor() {
    super(sceneConfig);

    this.ws = new WebsocketBuilder(`${API_URL}/ws?sessionId=asdf&name=${playerID}`)
        .onOpen((i, ev) => { console.log("ws openen") })
        .onClose((i, ev) => { console.log("ws closed") })
        .onError((i, ev) => { console.log("ws error") })
        .onMessage((i, ev) => {
          const msg: {message?: {type: string, id: string, x: number, y: number}} = JSON.parse(ev.data);

          if (!msg.message) {
            return;
          }

          switch (msg.message.type) {
            case "player_added":
              this.addPlayer(msg.message.id, {x: msg.message.x, y: msg.message.y});
              break;
            case "player_moved":
              this.movePlayer(msg.message.id, {x: msg.message.x, y: msg.message.y});
              break;
            case "player_remove":
              this.removePlayer(msg.message.id);
              break;
          }
        })
        .onRetry((i, ev) => { console.log("retry") })
        .build();
  }

  preload() {
    this.load.image("tiles", "src/assets/cloud_tileset.png");
    this.load.tilemapTiledJSON("cloud-city-map", "src/assets/cloud_city.json");
    this.load.spritesheet("player", "src/assets/characters.png", {
      frameWidth: 52,
      frameHeight: 72,
    });
  }

  create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
      layer.scale = 3;
    }

    const playerSprite = this.add.sprite(0, 0, "player");

    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 3, y: 3 },
          collides: false
        }
      ],
    };

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig);

    this.gridEngine.positionChangeStarted().subscribe(({charId, exitTile, enterTile}) => {
      this.ws.send(JSON.stringify({
        "type": "player_moved",
        "id": playerID,
        "x": enterTile.x,
        "y": enterTile.y
      }))
    });
  }

  addPlayer(id: string, pos: position) {
    const sprite = this.add.sprite(0, 0, "player");
    this.gridEngine.addCharacter({
      id: id,
      sprite: sprite,
      walkingAnimationMapping: 5,
      startPosition: pos,
      collides: false
    });

    players[id] = pos;
  }

  removePlayer(id: string) {
    const sprite = this.gridEngine.getSprite(id);

    this.gridEngine.removeCharacter(id);
    sprite?.destroy();
    delete players.id;
  }

  movePlayer(id: string, pos: position) {
    if (!players[id]) {
      this.addPlayer(id, pos);
      return;
    }

    this.gridEngine.moveTo(id, pos);
    players[id] = pos;
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }
}
