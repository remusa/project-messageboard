/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

const expect = require('chai').expect
const moongose = require('mongoose')
const database = require('../controllers/database')

const DATABASE =
    process.env.DB || 'mongodb://admin:admin123@ds121415.mlab.com:21415/fcc-infosec-challenges'

moongose.connect(DATABASE, { useNewUrlParser: true })

const Schema = moongose.Schema

const repliesSchema = new Schema({
    text: String,
    created_on: { type: Date, default: new Date() },
    delete_password: String,
    reported: { type: Boolean, default: false },
})

const threadSchema = new Schema({
    text: String,
    created_on: { type: Date, default: new Date() },
    bumped_on: { type: Date, default: new Date() },
    reported: { type: Boolean, default: false },
    delete_password: String,
    replies: [repliesSchema],
    replycount: { type: Number, default: 0 },
})

function thread(boardName) {
    return mongoose.model(boardName, threadSchema, boardName)
}

module.exports = function(app) {
    app.route('/api/threads/:board')

        .get((req, res) => {
            const { board } = req.params

            database.showAll(thread(board.toLowerCase()), res)
        })

        .post((req, res) => {
            const { board } = req.params
            const { delete_password } = body

            if (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('delete_password')) {
                return res.type('text').send('incorrect query')
            }

            const newThread = {
                text: req.body.text,
                reported: false,
                created_on: new Date(),
                bumped_on: new Date(),
                delete_password: delete_password,
            }

            const document = new thread(board.toLowerCase())(newThread)

            database.createThread(document, res, board.toLowerCase())
        })

        .put((req, res) => {
            const { board } = req.params
            const { thread_id } = req.body

            if (!req.body.hasOwnProperty('thread_id')) {
                return res.type('text').send('incorrect query')
            }

            database.reportThread(thread(board.toLowerCase()), thread_id, res)
        })

        .delete((req, res) => {
            const { board } = req.params
            const { thread_id, delete_password } = req.body

            if (
                !req.body.hasOwnProperty('thread_id') ||
                !req.body.hasOwnProperty('delete_password')
            ) {
                return res.type('text').send('incorrect query')
            }

            database.deleteThread(thread(board.toLowerCase()), thread_id, delete_password, res)
        })

    app.route('/api/replies/:board')

        .get((req, res) => {
            const { board } = req.params
            const { thread_id } = req.query

            if (!req.query.hasOwnProperty('thread_id')) {
                return res.type('text').send('incorrect query')
            }

            database.showThread(thread(board.toLowerCase()), thread_id, res)
        })

        .post((req, res) => {
            const { board } = req.params
            const body = req.body

            if (
                !req.body.hasOwnProperty('thread_id') ||
                (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('delete_password'))
            ) {
                return res.type('text').send('incorrect query')
            }

            database.createPost(thread(board.toLowerCase()), req.body, res, board.toLowerCase())
        })

        .put((req, res) => {
            const { board } = req.params
            const { thread_id, reply_id } = req.query

            if (!req.body.hasOwnProperty('thread_id') || !req.body.hasOwnProperty('reply_id')) {
                return res.type('text').send('incorrect query')
            }

            database.reportPost(thread(board.toLowerCase()), thread_id, reply_id, res)
        })

        .delete((req, res) => {
            const { board } = req.params
            const { thread_id, reply_id, delete_password } = req.query

            if (
                !req.body.hasOwnProperty('thread_id') ||
                (!req.body.hasOwnProperty('reply_id') ||
                    !req.body.hasOwnProperty('delete_password'))
            ) {
                return res.type('text').send('incorrect query')
            }

            database.deletePost(
                thread(board.toLowerCase()),
                thread_id,
                reply_id,
                delete_password,
                res
            )
        })
}
