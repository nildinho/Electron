const  {contextBridge, ipcRenderer } =  require('electron')

// gerenciamneto de processos (desempenho e segurança)
contextBridge.exposeInMainWorld('api', {
    verElectron: () => process.versions.electron,
    hello: () => ipcRenderer.send("send-message", "Oi!"),
    answer: (message) => ipcRenderer.on('receive-message', message),
    openAbout: () => ipcRenderer.send('open-about')
}) 

// Inserir data na página
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day:'numeric'
    }
    return data.toLocaleDateString('pt-br', options)
}

// interagir diretamente no DOM do documento html (index.html)
window.addEventListener('DOMContentLoaded', () => {
    const dataAtual = document.getElementById('dataAtual').innerHTML = obterData()
})

