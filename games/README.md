# Browser games

Upload each local HTML game into its own folder here, for example `games/my-game/index.html`. Add a record to `data/games.json` with `"launchType": "local-page"` and `"launchUrl": "games/my-game/index.html"`. Use relative asset links inside the game folder so the game works from the GitHub Pages repository path.

## Flash games

You may upload a `.swf` and its companion assets into a subfolder here (for example `games/my-flash-game/game.swf`). In Manage Games, choose the `Flash game (.swf) via Ruffle` launch type and set the path to that SWF. Ruffle is loaded from its official CDN on demand; it needs an internet connection and may not support every old Flash game.
