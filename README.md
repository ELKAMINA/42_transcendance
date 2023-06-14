This branch is for the main branch (production).

The workflow is :

Coding features on dev branch
Testing features on test branch
Pushing feature once validated to dev
Merging dev and master

Redux manage synchronous actions but as we're developping a fullstack app, we need to get our state, sometimes, asynhcronously => Redux thunks to manage asynschronous logic with redux

Thunk = piece of code that does some delay work
action = everytime we want to modify a state => Action