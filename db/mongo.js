const mongoose = require ('mongoose');
const clientOptions = {
    dbName            : 'dbPortDePlaisanceRussell',
};

/**
 * Initialise la connexion à la base de données MongoDB
 * @async
 * @returns {Promise<void>}
 */
exports.initClientDbConnection = async () => {
    try{
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}