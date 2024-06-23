// implement your posts router here
const express = require("express")
const helpers = require("./posts-model")

const router = express.Router()

router.get("/", async (req,res) => {
    try{
        const data = await helpers.find()
        res.status(200).json(data)
    } catch(error) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get("/:id", async (req,res) => {
    try {
        const {id} = req.params
        const data = await helpers.findById(id)
        if (!data) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(data)
        }

    } catch(error) {
        res.status(500).json({ message: 'The post information could not be retrieved' })
    }
})

router.get("/:id/comments", async (req,res) => {
    try {
        const {id} = req.params
        const post = await helpers.findById(id)
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const data = await helpers.findPostComments(id)
            res.status(200).json(data)
        }
    } catch(error) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

router.post("/", async (req, res) => {
    try {
        const {title, contents} = req.body
        if(!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const data = await helpers.insert({title, contents})
            res.status(201).json({id: data.id, title, contents})
        }

    } catch(error) {
        res.status(500).json({message: "There was an error while saving the post to the database" })
    }
})

router.put("/:id",async (req,res) => {
    try{
        const {id} = req.params
        const post = await helpers.findById(id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const {title, contents} = req.body 
            if (!title || !contents) {
                res.status(400).json({ message: "Please provide title and contents for the post" })
            } else {
                await helpers.update(id,{title, contents})
                const data = await helpers.findById(id)
                res.status(200).json(data)
            }
        }

    } catch(error) {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete("/:id", async (req,res) => {
    try {
        const {id} = req.params
        const post = await helpers.findById(id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            await helpers.remove(id)
            res.status(200).json(post)

        }
    }catch(error) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})
module.exports = router
