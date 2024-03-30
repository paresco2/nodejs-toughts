const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('toughts2','root','Relogio00@',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado ao banco com sucesso')
} catch (error) {
    console.log('houve um erro: ', error)
}

module.exports = sequelize