import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
    const [authUser, setAuthUser] = useState([])
    const [posts, setPosts] = useState([])

    const [header, setHeader] = useState("")
    const [description, setDescription] = useState("")
    const [headerError, setHeaderError] = useState([])
    const [descriptionError, setDescriptionError] = useState([])

    const [postSuccess, setPostSuccess] = useState("")

    const MakePost = () => {
        const formData = new FormData()
        formData.append("header", header)
        formData.append("description", description)
        if (header === '' || description === '') {
            if (header === '') {
                setHeaderError('The header field is required')
            } else {
                setHeaderError('')
            }
            if (description === '') {
                setDescriptionError('The description field is required')
            } else {
                setDescriptionError('')
            }
        } else {
            axios.post(
                "./makepost",
                formData,
                {
                    headers: {
                        "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content
                    }
                }
            ).then(response => {
                setHeader("")
                setHeaderError("")
                setDescription("")
                setDescriptionError("")
                setPostSuccess("The post was made successfully.")
                axios.get("./postsapi").then(response => {
                    setPosts(response.data)
                }).catch(error => console.log(error))
            }).catch(error => {
                if (!error.response.data.errors.header && !error.response.data.errors.description) {
                    window.location.reload();
                } else {
                    if (!error.response.data.errors.header) {
                        setHeaderError("")
                    } else {
                        setHeaderError(error.response.data.errors.header[0])
                    }
                    if (!error.response.data.errors.description) {
                        setDescriptionError("")
                    } else {
                        setDescriptionError(error.response.data.errors.description[0])
                    }
                }
            })
        }
    }

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
                    axios.get("./postsapi").then(response => {
                        setPosts(response.data)
                    }).catch(error => console.log(error))
                } else {
                    console.log(response.data)
                }
            }).catch(error => console.log(error))
    }

    useEffect(() => {
        axios.get("./authuserapi").then(response => {
            setAuthUser(response.data)
        }).catch(error => console.log(error))

        axios.get("./postsapi").then(response => {
            setPosts(response.data)
        }).catch(error => console.log(error))
    }, [])

    return (
        <>
            {
                authUser.map(authUserItem => (
                    (authUserItem.role == 'admin') ? (
                        <div key={1}>
                            <Form.Group className='mb-3'>
                                <Form.Label htmlFor='header'>Header</Form.Label>
                                <textarea rows={5} className="form-control" id='header' value={header} onChange={e => setHeader(e.target.value)}></textarea>
                                <b className="text-danger">{headerError}</b>
                                <b className="text-success">{postSuccess}</b>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Group htmlFor='description'>Description</Form.Group>
                                <textarea rows={10} className="form-control" id='description' value={description} onChange={e => setDescription(e.target.value)}></textarea>
                                <b className="text-danger">{descriptionError}</b>
                            </Form.Group>
                            <Button variant="success" onClick={() => MakePost()}>Submit</Button>
                            <hr />
                        </div>
                    ) : (<></>)
                ))
            }
            {
                (posts.length) ? (
                    posts.map(post => (
                        <div className="post" key={post.id}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <b dangerouslySetInnerHTML={{ __html: post.header }}></b>
                                </div>
                                {
                                    authUser.map(authUserItem => (
                                        (authUserItem.role === 'admin') ? (
                                            <Button variant='danger' key={post.id} onClick={() => DeletePost(post.id)}>X</Button>
                                        ) : (<></>)
                                    ))
                                }
                            </div>
                            <hr />
                            <div className='mb-3'>
                                <b dangerouslySetInnerHTML={{ __html: post.description }}></b>
                            </div>
                            <div>
                                <b>
                                    <Link to={`/post/${post.id}`}>Go to the post</Link>
                                </b>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="text-center">Posts do not exist.</h1>
                )
            }
        </>
    )
}

export default Home