import { Router, Express } from 'express'
import fg from 'fast-glob'

export default (app: Express) => {
    const router = Router()
    app.use('/api', router)
    /* 
        fg sonda todos os arquivos que terminam em .routes.ts na pasta de rotas
        método map importa cada arquivo retornado pelo fg
        parenteses confirmando o término do import antes de chamar o default do arquivo
        a função default retornada pelos arquivos de rota esperam o router 
    */
    fg.sync('**/src/main/routes/**/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
}