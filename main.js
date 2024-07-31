const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron')

// relacionado ao preload.js (path é o caminho)
const path = require('node:path')
// Janela Principal
const createWindow = () => {
  // nativeTheme.themeSource = 'dark'
  const win = new BrowserWindow({
    width: 800, //largura
    height: 600, //altura
    icon: './src/public/img/pc.png',
    //resizable: false, //evitar o redimensionamento
    //titleBarStyle:'hidden', //esconder barra de título e menu
    //autoHideMenuBar: true //esconder o menu
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // iniciar a janela com o menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile('./src/views/index.html')
}

// Janela sobre
let about // reslover bug de aberturas de varias janelas

const aboutWindow = () => {
  // se a janela about não estiver aberta
  if (!about) {
     about = new BrowserWindow({
      width: 360, //largura
      height: 220, //altura
      icon: './src/public/img/pc.png',
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true //esconder o menu
    })
  
  }
  
  about.loadFile('./src/views/sobre.html')
  // BUG 2 (reabrir a janela se estiver fechada )
  about.on('closed', () => {
      about = null
  })
}

// janela secundaria
const childWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if(father){
    const child = new BrowserWindow({
      width: 640,
      height: 450,
      icon:"./src/public/img/pc.png",
      autoHideMenuBar: true,
      resizable: false,
      parent: father, // janela estabelece a relação parent-childs
      modal: true //manter o foco do usuário na janela
    })
    child.loadFile('./src/views/child.html')
  }
}

// executar de forma assincrona a aplicação
app.whenReady().then(() => {
  createWindow()
})

// template do menu personalizado

const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
          label: 'Janela Secundaria',
          click: () => childWindow()
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4'
      }
    ]

  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: 'toggleDevTools'
      },
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'docs',
        click: () => shell.openExternal('https://www.electronjs.org/docs/latest/')
      },
      {
        type: 'separator'
      },
      {
        label: 'sobre',
        accelerator: 'Alt=F1',
        click: () => aboutWindow()
      }


    ]
  }
]

// Processos
console.log("Processo Principal")
// Exemplo de comando que só funciona no node.js
console.log(`Electron: ${process.versions.electron}`)
//exemplo 2: Recebimento de uma mensagem do renderer
ipcMain.on('send-message',(event, message) => {
  console.log(`processo principal recebeu uma mensagem: ${message}`)
  //enviar uma resposta ao renderizador
  event.reply('receive-message', "Olá! renderizador")
})

//exemplo 3: Recebimento de renderer de uma ação a ser executada
ipcMain.on('open-about', () => {
  aboutWindow()
})


