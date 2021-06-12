import Sequelize from 'sequelize';
import database from '../db.js';
 
const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    encryptedPwd: {
      type: Sequelize.STRING,
      allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
}
    
})
 
export default User;