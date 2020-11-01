import React from 'react'
import {useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import {parseCookies} from 'nookies'

const Create = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState('')
    const [media, setMedia] = useState("")
    const [description, setDescription] = useState("")
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        const mediaUrl = await imageUpdload()
        const res = await fetch(`${baseUrl}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                price,
                mediaUrl,
                description
            })
        })
        const data = await res.json()
        if(data.error) {
            M.toast({html: 'Please add all fields', classes: "red"})
        } else {
            M.toast({html: 'Product Saved', classes: "green"})
        }
    }

    const imageUpdload = async() => {
        const data = new FormData()
        data.append('file', media)
        data.append('upload_preset', 'mystore')
        data.append('cloud_name', 'yadu-cloud')
        const res = await fetch('https://api.cloudinary.com/v1_1/yadu-cloud/image/upload', {
            method: "POST",
            body: data
        })
        const res2 = await res.json()
        console.log(res2)
        return res2.url
    }

    return (
        <form className="container" onSubmit={(e) => handleSubmit(e)}>
            <input type='text' name='name' placeholder='name' value={name} 
             onChange={(e) => setName(e.target.value)}
            />
            <input type='text' name='price' placeholder='price' value={price} 
             onChange={(e) => setPrice(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>File</span>
                    <input type="file" accept='image/*' onChange={(e) => setMedia(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <img className='responsive-img' src={media ? URL.createObjectURL(media) : ""}/>
            <textarea name="description" placeholder="description" className="materialize-textarea"
             onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
            <button className="btn waves-effect waves-light" type="submit">Submit
              <i className="material-icons right">send</i>
            </button>
        </form>
    )
}

export async function getServerSideProps(ctx) {
    const cookie = parseCookies(ctx)
    const user = cookie.user ? JSON.parse(cookie.user) : ""  
    const {res} = ctx
    if(user.role !== 'admin') {
        res.writeHead(302, {Location: '/'})
        res.end()
    }

    return {
        props: {}
    }
}

export default Create
