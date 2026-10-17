# GSN — Gaming Station Network

A dark, console-inspired personal game launcher made with **plain HTML, CSS, and JavaScript**. It has no npm packages, no Node.js requirement, no build step, and no framework to install. It is made to be uploaded straight into a GitHub repository and hosted with GitHub Pages.

GSN is an original fan-made launcher interface and is not an official Xbox product.

## Put it on GitHub Pages — no terminal required

1. Download and extract `gsn-github-pages.zip` on your computer.
2. Sign in to GitHub and create a new repository. A name such as `gsn-launcher` works. For a personal landing page, GitHub also supports a repository named `YOUR-USERNAME.github.io`.
3. Open the new repository and choose **Add file → Upload files**.
4. Upload the **contents** of the extracted folder—not the ZIP itself. Make sure `index.html`, `app.js`, `styles.css`, `data/`, and `assets/` are at the top level of the repository.
5. Commit the upload.
6. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, and click **Save**.
7. Wait for GitHub Pages to finish publishing, then open the site URL shown in Settings → Pages. It usually looks like `https://YOUR-USERNAME.github.io/gsn-launcher/`.

That's it. Nothing to install or run locally. The launcher loads `data/games.json` over the web, so use the GitHub Pages URL rather than double-clicking `index.html` as a local file.

## What works

- Home dashboard with featured games, profile, shortcuts, decorative launcher/FPS badges, four customizable home panels, and several background modes.
- Responsive game library with search, game/app/cloud categories, grid/list layout, sorting, collection filtering, favorites, and details pages.
- Local profile editing and recently-played history.
- Personalization: accent color, theme, dashboard groups, and custom background image URL or uploaded image.
- Game manager: add, edit, and delete games; JSON import/export; local overrides and deletion markers saved in your current browser.
- Local demo chat, music URL playback, and a built-in Snake game that plays inside GSN.
- The game-selection sound system is ready for your own audio file.
- Keyboard shortcuts: `/` or `Ctrl+K` opens search; `Escape` closes an overlay or returns; arrow keys move focus across game tiles.

Some features are intentionally local-only. GSN does not provide real online accounts, online friends, real-time chat, paid store purchases, cloud-gaming servers, or an actual FPS measurement.

## Add a game by editing JSON

Open `data/games.json` in GitHub, click the pencil/edit icon, and add a new record inside the array. Include a comma after the previous record. Example:

```json
{
  "id": "my-game",
  "title": "My Game",
  "type": "game",
  "image": "assets/covers/my-game.png",
  "description": "A short description of the game.",
  "developer": "",
  "releaseYear": null,
  "genres": ["Arcade"],
  "tags": ["browser"],
  "collection": "Arcade",
  "dateAdded": "2026-10-17",
  "launchType": "url",
  "launchUrl": "https://example.com/your-game",
  "openInNewTab": true,
  "aliases": ["Optional name"]
}
```

Use a real launch URL instead of the example above. Commit the JSON change and refresh your Pages site. It should appear automatically. IDs should be unique and use letters, numbers, dashes, and underscores.

### Add your own cover art

1. In the repository, open `assets/covers/`.
2. Upload the new cover image, for example `my-game.png`.
3. Set the JSON image path to `assets/covers/my-game.png`.
4. Commit the changes and refresh the site.

Supported common browser image formats include PNG, JPEG, WebP, and SVG. If an image can't load, GSN displays its own fallback cover.

### Manage games inside GSN

Open **Manage games** from the left edge of the library. Add/edit/delete operations are stored in local browser storage; GitHub Pages cannot rewrite the committed JSON file. To make those changes permanent for every visitor, use **Export JSON**, then upload/replace `data/games.json` in your repository and commit the change. You can also import an existing JSON array from this page.

### Launch types

- `url`: open an external HTTPS/HTTP game URL in a new tab when `openInNewTab` is `true`.
- `new-tab`: force a new tab.
- `iframe`: attempt to embed the URL in a player. Some external sites block embedding; use a new tab for those.
- `local-page`: launch a local HTML game in the repository, for example `games/my-game/index.html`. The file must be uploaded to the repository too.
- `builtin`: for built-in games implemented inside GSN. The provided Snake game uses `launchUrl: "snake"`.

For games you host yourself, create a folder under `games/`, upload your game's `index.html` and asset files, and use a project-relative launch path such as `games/my-game/index.html`. Do not use `file:///` paths or expect a website to execute `.exe` files. Browser security rules still apply.

## Add the selection sound

Upload your own click audio file to this exact location:

`assets/audio/game-select.mp3`

The browser will try to play it when selecting/opening a game and launching it. No sound file is bundled. Missing audio is handled quietly. The Enable sound effects and volume settings control playback.

## Personalization

Open **Personalization** to select Game art, GSN dynamic, Static, or Your image. Use an `https://` image URL or a project path such as `assets/backgrounds/wallpaper.jpg`; you can also choose a local image file to save a browser-local copy. Change accent colors and themes, and enable/disable dashboard groups. Settings are local to the browser that made the changes and do not sync to other devices.

## Important GitHub Pages notes

- Keep paths relative (`assets/...`, `data/games.json`, `games/...`) so the site works when published under a repository subpath.
- The JSON library must remain valid JSON. One missing comma can stop the file from loading.
- External games may require a new tab; the host controls whether its game can be embedded.
- Local browser changes are not committed to GitHub automatically. Export JSON and commit it to preserve those changes in the repository.
