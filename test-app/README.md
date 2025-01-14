This is a test application for testing the client library.

## Testing procedude

First, make sure you have build the newest version in the parent folder:

```bash
pushd ..
yarn build
popd
```

Then, run yarn to have the newest version of the library included:

```bash
yarn
```

Finally, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result of a dynamic (`import`) load.

Static build can be tested on [http://localhost:3000/static.html](http://localhost:3000/static.html).


## Deploy on Vercel

Run `vercel` and check there.