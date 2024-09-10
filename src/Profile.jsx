import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import Layout from './Layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MdOutlineWindow } from "react-icons/md";
import { FaPlay, FaTrash } from "react-icons/fa";
import { LuUserSquare } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FaRegHeart, FaHeart } from "react-icons/fa";




export default function Profile() {

    const params = useParams()

    const [followingCount, setFollowingCount] = useState(0)

    const [followersCount, setFollowersCount] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false)

    const [user, setUser] = useState({})

    const [isMe, setIsMe] = useState(false)

    useEffect(() => {
        setFollowersCount(0)
        setFollowingCount(0)
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/profile/${params.username ?? 'me'}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(s => s.json()).then(result => {
            setUser(result.data[0])
            setPosts(result.userposts)
            setFollowersCount(result.followersCount)
            setFollowingCount(result.followingCount)
            setIsFollowing(result.isFollowing)
            setIsMe(result.isMe)
        })
    }, [params.username])

    const [selectedArea, setSelectedArea] = useState("posts")

    const [posts, setPosts] = useState([])

    const loggedUsername = localStorage.getItem("loggedUsername")
    const followUser = () => {
        if (isFollowing == false) {
            const token = localStorage.getItem("token")
            fetch(`http://localhost:8080/follow-user/${user.username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }).then(s => s.json()).then(result => {
                if (result.success) {
                    setIsFollowing(true)
                    setFollowersCount(followersCount + 1)
                }
            })
        } else {
            const token = localStorage.getItem("token")
            fetch(`http://localhost:8080/unfollow-user/${user.username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }).then(s => s.json()).then(result => {
                if (result.success) {
                    setIsFollowing(false)
                    setFollowersCount(followersCount - 1)
                }
            })
        }

    }

    const followUserFromDialog = (account) => {
        const token = localStorage.getItem("token")
        if (account.following == false) {
            fetch(`http://localhost:8080/follow-user/${account.username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }).then(s => s.json()).then(result => {
                if (result.success) {
                    if (followers.find(follower => follower.id == account.id)) {
                        setFollowers(followers.map(follower => {
                            if (follower.id == account.id) {
                                follower.following = true;
                                if (isMe)
                                    setFollowingCount(followingCount + 1)
                            }
                            return follower
                        }))
                    }
                    if (follow.find(follower => follower.id == account.id) && !isMe) {
                        setFollow(follow.map(follower => {
                            if (follower.id == account.id) follower.following = true;
                            return follower
                        }))
                    }
                }
            })
        } else {
            fetch(`http://localhost:8080/unfollow-user/${account.username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }).then(s => s.json()).then(result => {
                if (result.success) {
                    if (followers.find(follower => follower.id == account.id)) {
                        setFollowers(followers.map(follower => {
                            if (follower.id == account.id) {
                                follower.following = false;
                                if (isMe)
                                    setFollowingCount(followingCount - 1)
                            }
                            return follower
                        }))
                    }
                    if (follow.find(follower => follower.id == account.id) && !isMe) {
                        setFollow(follow.map(follower => {
                            if (follower.id == account.id) follower.following = false;
                            return follower
                        }))
                    }
                }
            })
        }

    }

    const [followers, setFollowers] = useState([])
    const [follow, setFollow] = useState([])

    const fetchFollowers = () => {
        setFollowers([])
        const token = localStorage.getItem("token")
        fetch(`http://localhost:8080/followers/${user.username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(s => s.json()).then(result => {
            setFollowers(result.data)
        })
    }

    const fetchFollow = () => {
        setFollow([])
        const token = localStorage.getItem("token")
        fetch(`http://localhost:8080/follow/${user.username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(s => s.json()).then(result => {
            setFollow(result.data)
        })
    }
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

    const deletePost = (post_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/posts/${post_id}`, {
            method: 'DELETE',
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
            setPosts(posts.filter(post => post.id != post_id))
        })
    }

    return (
        <Layout>
            <div className='flex items-center gap-6'>
                <Avatar className="h-32 w-32">
                    <AvatarImage src={user.profile_photo} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <h1 className='text-3xl pb-2'>{user.username}</h1>
                    <div className='flex items-center gap-6'>
                        <div><b>{posts.length}</b> Paylaşım</div>
                        <div>
                            <Dialog>
                                <DialogTrigger onClick={fetchFollowers}><b>{followersCount}</b> Followers</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Followers</DialogTitle>
                                        <DialogDescription>
                                            <ScrollArea className="h-[300px] w-full rounded-md border p-1">
                                                {followers.map(account => (
                                                    <div key={account.id}>
                                                        <div>

                                                            <div className='p-2 flex items-center gap-2 justify-between'>
                                                                <Link to={`/profile/${account.username}`}>
                                                                    <DialogClose asChild>
                                                                        <div className='flex items-center gap-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={account.profile_photo} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar> {account.username}
                                                                        </div>
                                                                    </DialogClose>
                                                                </Link>
                                                                <div>
                                                                    {loggedUsername == account.username ? "" : <Button onClick={() => followUserFromDialog(account)}>{account.following ? "Takipten Çıkar" : "Takip Et"}</Button>}
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Dialog>
                                <DialogTrigger onClick={fetchFollow}><b>{followingCount}</b> Follow</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Follow</DialogTitle>
                                        <DialogDescription>
                                            <ScrollArea className="h-[300px] w-full rounded-md border p-1">
                                                {follow.map(account => (
                                                    <div key={account.id}>
                                                        <div>
                                                            <div className='p-2 flex items-center gap-2 justify-between'>
                                                                <Link to={`/profile/${account.username}`}>
                                                                    <DialogClose asChild>
                                                                        <div className='flex items-center gap-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={account.profile_photo} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar> {account.username}
                                                                        </div>
                                                                    </DialogClose>
                                                                </Link>
                                                                <div>
                                                                    {loggedUsername == account.username ? "" : <Button onClick={() => followUserFromDialog(account)}>{account.following ? "Takipten Çıkar" : "Takip Et"}</Button>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className='py-2'>
                        <p>desc area</p>


                    </div>
                </div>
                <div>
                    {isMe ? "" : <Button onClick={() => followUser()}>{isFollowing ? "Takipten Çıkar" : "Takip Et"}</Button>}
                </div>
            </div>

            <div className='flex items-center gap-6 pt-10 justify-center border-b-[2px] pb-3'>
                <button className={`flex items-center pt-1 gap-1 ${selectedArea == 'posts' ? 'border-t-[2px]' : ''}`} onClick={() => setSelectedArea("posts")}>
                    <MdOutlineWindow /> Posts
                </button>
                <button className={`flex items-center  pt-1 gap-1 ${selectedArea == 'reels' ? 'border-t-[2px]' : ''}`} onClick={() => setSelectedArea("reels")}>
                    <FaPlay />  Reels
                </button>
                <button className={`flex items-center  pt-1 gap-1 ${selectedArea == 'tagged' ? 'border-t-[2px]' : ''}`} onClick={() => setSelectedArea("tagged")}>
                    <LuUserSquare /> Tagged
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4 py-1">

                {posts.map(post => (
                    <div key={post.id}>
                        <Dialog className="p-0">
                            <DialogTrigger><img className='h-60 object-contain bg-white' src={post.image} alt="" /></DialogTrigger>
                            <DialogContent className="p-0">
                                <DialogHeader>
                                    <DialogTitle className="p-2">
                                        <div className='flex items-center gap-2'>
                                            <Avatar>
                                                <AvatarImage src={user.profile_photo} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>{user.username}</div>
                                            <div>
                                                {isMe ? <Button onClick={() => deletePost(post.id)}><FaTrash /></Button> : ""}
                                            </div>

                                        </div>
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    <img className='h-96 object-contain bg-white w-full' src={post.image} alt="" />
                                    <div className='p-3'>
                                        <div onClick={() => likePost(post.id)} className='flex items-center gap-1'>
                                            {post.user_liked ? (
                                                <FaHeart size={24} />
                                            ) : <FaRegHeart size={24} />
                                            }
                                            {post.post_like}
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>

                    </div>
                ))}
            </div>
        </Layout>
    )
}
