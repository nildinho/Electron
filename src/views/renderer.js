/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização")

// vinculado ao preload.js
console.log(`Electron: ${api.verElectron()}`)

// envio de uma mensagem
api.hello("Oi!")

// rebimento de uma mensagem
api.answer((event, message)=> {
    console.log(`Processo de renderização recebeu uma mensagem: ${message}`)
})

// função que é executada quando o botão for clicado
function sobre () {
    api.openAbout()
}