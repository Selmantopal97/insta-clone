import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MdExplore } from "react-icons/md";
import { TiMessage } from "react-icons/ti";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { IoIosHome, IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Layout from './Layout';


function App() {
  const [posts, setPosts] = useState([])
  const [likeCount, setLike] = useState([])

  const navigate = useNavigate()

  useEffect(function () {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login")
      return;
    }
    fetch("http://localhost:8080/posts", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(s => {
      if (s.status != 200) {
        localStorage.removeItem("token")
        return navigate("/login")
      }
      return s.json()
    }).then(result => setPosts(result.data))
  }, [])

  const likePost = (post_id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login")
      return;
    }
    fetch(`http://localhost:8080/like-post/${post_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(s => {
      if (s.status != 200) {
        localStorage.removeItem("token")
        return navigate("/login")
      }
      return s.json()
    }).then(result => {
      setPosts(posts.map(post => {
        if (post.id == post_id) {
          post.user_liked = result.isLike;
          if (result.isLike) {
            post.post_like = post.post_like + 1
          } else {
            post.post_like = post.post_like - 1
          }
        }
        return post
      }))


    })
  }

  return (
    <>
      <Layout>
        {posts.map(post => (
          <Card className="p-0 mb-5" key={post.id}>
            <CardHeader className="p-2">
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={post.profile_photo} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Link to={`/profile/${post.username}`}>
                  {post.username}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img src={post.image} className='w-full h-96 object-contain' />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-2">
              <div onClick={() => likePost(post.id)} className='flex items-center gap-1'>
                {post.user_liked ? (
                  <FaHeart size={24} />
                ) : <FaRegHeart size={24} />
                }
                {post.post_like}
              </div>
              <p>{post.description}</p>
              <p>{(new Date(post.created_at).toString())}</p>
            </CardFooter>
          </Card>
        ))}
      </Layout>
    </>
  )
}

export default App
