<h1 align="center"><a href="https://www.electronjs.org/">Electron.js</a> Autodrawer for Paint 3D</h1>

An Autodrawer for Paint 3D created using Electron.js and Robot.js. An improvement of my [Node.js Autodrawer for Paint 3D](https://github.com/FelipeFlohr/node-autodrawer)

**Sections:**

---
## 1. Requirements
The following items are required to run the Autodrawer:
- Windows 10 or 11.
- [Microsoft Paint 3D](https://www.microsoft.com/en-us/p/paint-3d/9nblggh5fv99)

## 2. Pre-Building
Before building the project, the following items are required:
- Windows 10 or 11
- [Node.js](https://nodejs.org/en/)
- [Python](https://www.python.org/)

After all requirements are met, you'll need to execute the following lines on CMD:
```
npm install --global --production windows-build-tools
```
```
npm install -g node-gyp
```

Now it is necessary to install all dependencies. This can be done executing ```npm i``` on project's root folder. Once all deps are installed, you'll need to recompile Robot.js to the current Node version. To do this, execute the following line on CMD:
```
npm run rebuild
```

## 3. Building
Inside *package.json*, you will find the following scripts:
- "build": build the project
- "build-electron": build the project and runs it on production mode
- "build-electron-dev": build the project and runs it on developer mode
- "build-dist": build the project and compiles to Windows x64
- "electron": runs the project on production mode
- "electron-dev": runs the project on developer mode
- "dist": compiles to Windows x64

To execute a script, just run ```npm run [script-name]``` on CMD.

## 4. Usage
To learn how to use, check the "Help" page available inside the program.

## 5. License
Feel free to do whatever you want with this code :)