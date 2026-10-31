const mongoose = require('mongoose');
const connectDB = require('../db');
const { User, Contact, Favor } = require('../models');

const DB_NAME = 'banyan_checkpoint2_yixu';

async function seed() {
  await connectDB();

  if (mongoose.connection.name !== DB_NAME) {
    throw new Error('Seed is restricted to the isolated checkpoint database.');
  }

  await Promise.all([User.init(), Contact.init(), Favor.init()]);
  const owner = await User.findOneAndUpdate(
    {email:'alex.demo@example.com'}, 
    {$set:{name:'Alex Demo',role:'user',loginEnabled:false}}, 
    {upsert:true,new:true,runValidators:true}
  );

  await User.findOneAndUpdate(
    {email:'jamie.demo@example.com'},
    {$set:{name:'Jamie Demo',role:'user',loginEnabled:false}},
    {upsert:true,new:true,runValidators:true}
  );

  for (const [name,relationship,city,birthday] of [['Taylor Demo','friend','Fullerton','2001-05-14'],['Morgan Demo','family','Anaheim','1999-09-20'],['Casey Demo','colleague','Irvine','2000-11-02']]) {
    await Contact.findOneAndUpdate({owner:owner._id,name}, {$set:{relationship,city,birthday:new Date(birthday),lastInteractionAt:new Date('2026-10-20T12:00:00Z')}}, {upsert:true,new:true,runValidators:true});
  }

  const contacts = await Contact.find({owner:owner._id}).sort({name:1});
  const fixtures = [[0,'given','small','Helped review a class assignment.','2026-10-18'],[1,'received','large','Helped move furniture.','2026-10-19'],[2,'given','medium','Helped prepare a presentation.','2026-10-20']];

  for (const [i,direction,size,note,date] of fixtures) {
    await Favor.findOneAndUpdate(
      {owner:owner._id,contact:contacts[i]._id,note}, 
      {$set:{direction,size,occurredAt:new Date(date)}},
      {upsert:true,new:true,runValidators:true}
    );
  }
  console.log(JSON.stringify({database:mongoose.connection.name,users:await User.countDocuments(),contacts:await Contact.countDocuments(),favors:await Favor.countDocuments()},null,2));
}
seed().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>mongoose.disconnect());
