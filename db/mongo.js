const mongoose = require ('mongoose');

//Initialisation connexion Mongodb

const clientOptions = {
    dbName            : 'dbPortDePlaisanceRussell',
};

exports.initClientDbConnection = async () => {
    try{
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}