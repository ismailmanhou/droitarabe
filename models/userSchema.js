/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    username: { 
        type: String, 
        required : [true,'Please enter an username'],
        unique : true ,
        lowercase : true
    
    },
    password: { 
        type: String ,
        required:[true,'Please entre an password'],
        minLength : [6,'Minimum password lenght a 6 characters']
    }
});


userSchema.statics.login = async function (username,password) {
    const user = await this.findOne({username});
    if (user) {
        const auth = await bcrypt.compare(password,user.password);

        if (auth) {
            return user;
        }
        throw Error('icorrect password');
    }
    throw Error('incorrect username');
};
// Fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
});

// fire a function before doc saved to db
userSchema.pre('save',async function (next) {
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password,salt);
    next();
});
// Create a model based on that schema
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;