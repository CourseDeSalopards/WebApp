
import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {Popup} from "@workadventure/iframe-api-typings";
import {closePopup, onClock, onPlayerInside, onPlayerOutside, onPlayerSpawn} from "./events";
import { ObjectWaitingRoom } from "./objectWaitingRoom";

console.log('Script started successfully');

let clockPopUp: Popup;
const startGameBtnName = 'startGameBtn';

function getPlayers(): Set<string> {
    if (!WA.state.loadVariable('players')) {
        console.log('players not found, go undefined')
        WA.state.saveVariable('players', [])
    }

    const res = WA.state.loadVariable('players') as string[] || []
    return new Set(res)
}

WA.onInit().then(async () => {
    getPlayers()
    // sound
    const paralysedSound = WA.sound.loadSound('../../public/sound/waitingRoom.wav')
    paralysedSound.play({loop: true})

    onPlayerSpawn(WA.player);
    onPlayerInside(ObjectWaitingRoom.INSIDE, async () => {
        if (!WA.player.uuid) {
            console.error('Player UUID not found');
            return;
        }

        WA.room.hideLayer(ObjectWaitingRoom.WALLS);
        // WA.event.broadcast('playerInside', WA.player.uuid);
        const players = getPlayers()
        players.add(WA.player.uuid)
        
        await WA.state.saveVariable('players', Array.from(players))
        // WA.event.broadcast('players', Array.from(getPlayers()))
    });
    onPlayerOutside(ObjectWaitingRoom.OUTSIDE, async () => {
        if (!WA.player.uuid) {
            console.error('Player UUID not found');
            return;
        }

        WA.room.showLayer(ObjectWaitingRoom.WALLS);
        // WA.event.broadcast('playerOutside', WA.player.uuid);

        const players = getPlayers()
        players.delete(WA.player.uuid)

        await WA.state.saveVariable('players',  Array.from(players))
        // WA.event.broadcast('players', Array.from(getPlayers()))
    });

    WA.event.on('teleportPlayer').subscribe(async (ev) => {
        if (WA.player.uuid === ev.data) {
            // random delay from 1 to 5 seconds
            const delay = Math.floor(Math.random() * 2) + 1;
            await new Promise((resolve) => setTimeout(resolve, delay * 200));
            WA.nav.goToRoom('../maps/cds.tmj');
        }
    })

    const subPlayers = WA.state.onVariableChange('players').subscribe((x) => {
        // players = x as string[] || []
        console.log('players changed', x)
        console.log('players changed', getPlayers())
    })

    onClock(clockPopUp)

    WA.ui.actionBar.addButton({
        id: startGameBtnName,
        label: 'Start game',
        callback: (event) => {
        console.log('players', getPlayers().size)
            if (getPlayers().size < 2) {
                const popup = WA.ui.openPopup('popup', 'You need at least 2 players to start the game', []);
                setTimeout(() => closePopup(popup), 2000)
                return;
            }

            // TELEPORT TO ROOM
            for (const player of Array.from(getPlayers().values())) {
                console.log("teleport", player)
                WA.event.broadcast('teleportPlayer', player)
            }
                
        }
    });

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


export {};
