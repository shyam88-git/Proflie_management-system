const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const User=require('../models/User');
const{body,validationResult}=require('express-validator');
const authenticate = require('../middleware/authenticate');
const { find } = require('../models/Profile');
const Profile = require('../models/Profile');

/**
 * @usage: Create a post
 * @URL: /api/posts/
 * @fields:text,image
 * @method: POST
 * @access: private
 */

router.post('/',[
    body('text').notEmpty().withMessage("Text is required"),
    body('image').notEmpty().withMessage("Image is required"),
    
],authenticate,async(request,response)=>{

    //check for validation rule
    let errors=validationResult(request);

    if(!errors.isEmpty()){

         return response.status(400).json({errors: errors.array()});
    }

 try{
        //extract data from request object
        let {text,image }=request.body;

        


        let user=await User.findById(request.user.id);

        //create Post Object
        let newPost={


            user:request.user.id,
            text,
            image,
            name:user.name,
            avatar:user.avatar
    }

        //create the post object
        let post=new Post(newPost);

        post= await post.save();//save to database

        response.status(200).json({
            msg:'Post is created',
            post:post});



 }
 catch(error){

    console.error(error);
    return response.status(400).json({errors:[{msg : error.message}]});
 }

});

/**
 * @usage: Get all  posts
 * @URL: /api/post/
 * @fields: no-fields
 * @method: Get
 * @access: private
 */

router.get('/',authenticate ,async(request,response)=>{

    try{

        let posts=await Post.find();
        if(!posts){
            return response.status(400).json({erros:[{msg:'Post not found'}]});
        }
        response.status(200).json({posts:posts});




    }
    catch(error){
        console.error(error);
        return response.status(400).json({errors:[{error:error.message}]});
    }
});

/**
 * @usage: Get a post with postid
 * @URL: /api/posts/:postId
 * @fields: no-fields
 * @method: Get
 * @access: private
 */

router.get('/:postId',authenticate,async(request,response)=>{

    try{

        let postId=request.params.postId;

        let post=await Post.findById(postId);

        if(!post){

            return response.status(400).json({msg:'Post id is not found'});
        }

        response.status(200).json({post:post});


    }
    catch(error){

        console.error(error);
        return response.status(400).json({errors:[{error: error.message}]});
    }
});

/**
 * @usage: Delete  a post with postid
 * @URL: /api/posts/:postId
 * @fields: no-fields
 * @method: Delete
 * @access: private
 */

 
router.delete("/:postId", authenticate, async (request, response) => {
    try {
        const postId = request.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return response.status(400).json({ errors: [{ msg: 'Post Id not found' }] });
        }

        await Post.findByIdAndDelete(postId);

        return response.status(200).json({msg:'Post Id deleted Successfully'});
    } catch (error) {
        console.error(error);
        return response.status(400).json({ errors: [{ error: error.message }] });
    }
});

/**
 * @usage: Like  a post with postid
 * @URL: /api/posts/like/:postId
 * @fields: no-fields
 * @method: put
 * @access: private
 */

router.put('/like/:postId',authenticate, async(request,response)=>{

    try{

            let postId=request.params.postId;
        //check if the user exist or not

        let post=await Post.findById(postId);

        if(!post){

            return response.status(400).json({errors:[{msg:'No Post Found'}]});
        }

        //check user has been liked of not

        if(post.likes.filter(like=>like.user.toString()===request.user.id.toString()).length>0)
        {

            return response.status(400).json({errors:[{msg:'Post has been already added'}]});
        }



        //like the post

        post.likes.unshift({user:request.user.id});
        post.save();
        response.status(200).json({post:post});


    }
    catch(error){

        console.error(error);
        return response.status(500).json({errors:[{error:error.message}]});
    }
});
/**
 * @usage: UnLike  a post with postid
 * @URL: /api/posts/unlike/:postId
 * @fields: no-fields
 * @method: put
 * @access: private
 */

router.put('/unlike/:postId',authenticate,async(request,response)=>{

    let postId=request.params.postId;

    try{

        //check Post id is exist or not

        let post=await Post.findById(postId);
        if(!post){

            return response.status(400).json({errors:[{msg:'Post Id is not found'}]});
        }

        //check user has been liked or not

         if(post.likes.filter(like=>like.user.toString()===request.user.id.toString()).length===0){

             return response.status(400).json({errors:[{msg:'Post has not been liked'}]});
         }

         //unlike the post

         let removableIndex=post.likes.map(like=>like.user.toString()).indexOf(request.user.id.toString());
          if(removableIndex!==-1){
           post.likes.splice(removableIndex,1);
           post.save();
           return response.status(200).json({post:post});



          }
        




    }
    catch(error){

        console.error(error);
        return response.status(500).json({errors:[{error:error.message}]});
    }
})


module.exports=router;