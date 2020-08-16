# UrbanForecast
Browse forecast results

To develop

* download and install a recentish version of [Node.js](https://nodejs.org/en/)
* clone this repo
* in this repo run
  * `yarn install`
  * `yarn start` - a browser window will open and any code edits will refresh the browser
  
To deploy

* `yarn build`
* copy the .js file (e.g. `urbanexplorer-v0.0.2.js`) from `dist` to `docs/dist` and commit (gh-pages is run from docs directory in this repo)
* bump versions when appropriate and update `docs/index.html` when the version/filename is updated
