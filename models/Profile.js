const mongoose=require('mongoose');
const ProfileSchema= new mongoose.Schema({


        user : {



                type : mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true


        },

        company : {

            type : String , required : true
        },

        website : {

            type: String , required : true
        },

        location : {

            type :String , required : true
        },

        designation : {

            type :String , required : true
        },

        skills : {

            type :[String] , required : true
        },

        bio: {

            type :String , required : true
        },

        githubUsername : {

            type :String , required : true
        },

        experience : [

            {

               tital : {type : String },
               company : {type : String },
               location : {type : String },
               from : {type : String },
               to : {type : String },
               current : {type : Boolean },
               description : {type : String },
            }
        ],

        eduction : [

            {

               school : {type : String },
               degree : {type : String },
               fieldOfStudy : {type : String },
               from : {type : String },
               to : {type : String },
               current : {type : Boolean },
               description : {type : String },
            }
        ],

        social : {


            youtube : { type : String , require: true },
            twitter: { type : String , require : true},
            facebook : { type : String ,require: true},
            linkedin : { type : String,require: true },
            instagram : { type : String ,require: true},
        }





}, {timestamps :true});


const Profile =mongoose.model('profile' ,ProfileSchema);
module.exports=Profile;