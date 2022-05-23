const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/demojs')
  .then(() => console.log('Connected to mongo'))
  .catch((err) => console.error('Pas pu se connecter,', err))

const userSchema = new mongoose.Schema({
  id: Number,
  email: String,
  username: String,
  password: String
});


const User = mongoose.model('User', userSchema);

async function createUser(obj){

  // ici l'objet n'exite pas en BDD.
  const user = new User(obj)
  // ici l'objet n'exite pas non plus en BDD.

  return user.save() // je peux await pcq c'est une promesse.
}

const p1 = createUser({id: 0,
  email: "mail@mail.mail",
  username: "admin",
  password: hashIt("password")});

const p2 = createUser({id: 1,
  email: "admin@admin.com",
  username: "local",
  password: hashIt("admin")});



Promise.all([p1, p2])
  .then(async () => {
    const all_docs = await User.find();
    console.log(all_docs);

    const filtered_docs = await User.find({id: 0})
    console.log(filtered_docs)

    const oneUser = await User.findOne();
    console.log(oneUser);
    console.log(oneUser._id);

    oneUser.name = "MODIFIED";

    const result = await oneUser.save()

    console.log(result);

    mongoose.connection.close()})
