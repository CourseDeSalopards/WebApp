import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {setupCourseTriggers} from "./events/game-race/area-triggers";
import {GameRaceEvents, paralyseOthers, setupGameListeners} from "./events/game-race/events";

console.log('Script started successfully');


WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)
    console.log('Player id: ', WA.player.playerId)

    setupCourseTriggers()
    setupGameListeners()
    await startGame()

    // Add action bar button 'Register'.
    WA.ui.actionBar.addButton({
        id: 'malus',
        type: 'action',
        imageSrc: 'https://upload.wikimedia.org/wikipedia/fr/archive/0/01/20211228035137%21RATP.svg',
        toolTip: 'Utiliser un objet contre vos adversaire!',
        callback: (event) => {
            console.log('Action bar button clicked', event);
            paralyseOthers()
        }
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

async function startGame() {
    await WA.event.broadcast(GameRaceEvents.GAME_START_COUNTDOWN, {})
}