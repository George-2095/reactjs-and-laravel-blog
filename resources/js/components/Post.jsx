import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

function Post() {
    const { id } = useParams()
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])

    const [authUser, setAuthUser] = useState([])

    const [comment, setComment] = useState("")
    const [commentError, setCommentError] = useState("")
    const [commentSuccess, setCommentSuccess] = useState("")

    useEffect(() => {
        axios.get("/authuserapi").then(response => {
            setAuthUser(response.data)
        }).catch(error => console.log(error))

        axios.get(`/postapi/${id}`).then(response => {
            setPost(response.data)
        }).catch(error => console.log(error))

        axios.get(`/commentsapi/${id}`).then(response => {
            setComments(response.data)
        }).catch(error => console.log(error))
    }, [])

    const DeletePost = (id) => {
        const formData = new FormData()
        formData.append("id", id)
        axios.post("/deletepost",
            formData,
            {
                headers: {
                    "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content
                }
            }).then(response => {
                if (response.data === '') {
                    window.location = '/'
                } else {
                    console.log(response.data)
                }
            }).catch(error => console.log(error))
    }

    const MakeComment = () => {
        const formData = new FormData()
        formData.append("postid", id)
        formData.append("comment", comment)
        if (comment === '') {
            setCommentError("The comment field is required.")
        } else {
            axios.post("/makecomment",
                formData,
                {
                    headers: {
                        "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content
                    }
                }
            ).then(response => {
                setComment("")
                setCommentError("")
                setCommentSuccess("The comment made successfully.")
                axios.get(`/commentsapi/${id}`).then(response => {
                    setComments(response.data)
                }).catch(error => console.log(error))
            }).catch(error => {
                if (!error.response.data.errors.postid && !error.response.data.errors.comment) {
                    window.location.reload();
                } else {
                    (error.response.data.errors.postid) ? (
                        console.log(error.response.data.errors.postid[0])
                    ) : (<></>)
                    if (!error.response.data.errors.comment) {
                        setCommentError("")
                    } else {
                        setCommentError(error.response.data.errors.comment[0])
                    }
                }
            })
        }
    }

    const DeleteComment = (commentid) => {
        const formData = new FormData()
        formData.append("id", commentid)
        axios.post("/deletecomment",
            formData,
            {
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
                }
            }).then(response => {
                axios.get(`/commentsapi/${id}`).then(response => {
                    setComments(response.data)
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
    }

    return (
        <>
            {
                (post.length) ? (
                    post.map(postitem => (
                        <div className="post" key={postitem.id}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <b dangerouslySetInnerHTML={{ __html: postitem.header }}></b>
                                </div>
                                {
                                    authUser.map(auhtuseritem => (
                                        (auhtuseritem.role === 'admin') ? (
                                            <Button variant='danger' key={postitem.id} onClick={() => DeletePost(postitem.id)}>X</Button>
                                        ) : (<></>)
                                    ))
                                }
                            </div>
                            <hr />
                            <div>
                                <b dangerouslySetInnerHTML={{ __html: postitem.description }}></b>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="text-center">The post does not exist.</h1>
                )
            }
            <hr />
            <h1>Comments:</h1>
            <div className="comments">
                {
                    comments.map(commentitem => (
                        <div className="post" key={commentitem.id}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>{commentitem.commentby}</b>
                                </div>
                                {
                                    authUser.map(auhtuseritem => (
                                        (auhtuseritem.id === commentitem.commentbyid) ? (
                                            <Button variant='danger' key={commentitem.id} onClick={() => DeleteComment(commentitem.id)}>X</Button>
                                        ) : (<></>)
                                    ))
                                }
                            </div>
                            <hr />
                            <b dangerouslySetInnerHTML={{ __html: commentitem.comment }}></b>
                        </div>
                    ))
                }
            </div>
            <hr />
            <h3>Make comment</h3>
            <Form.Group className='mb-3'>
                <textarea id="comment" rows="10" className="form-control" value={comment} onChange={e => setComment(e.target.value)}></textarea>
                <b className="text-danger">{commentError}</b>
                <b className="text-success">{commentSuccess}</b>
            </Form.Group>
            <Button variant="success" onClick={() => MakeComment()}>Submit</Button>
        </>
    )
}

export default Post