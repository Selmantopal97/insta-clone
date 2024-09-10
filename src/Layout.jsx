import { React, useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MdExplore } from "react-icons/md";
import { TiMessage } from "react-icons/ti";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { IoIosHome, IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export default function Layout({ children }) {
  const [user, setUser] = useState({})

  const [newFriends, setNewFriends] = useState([])

  const [postDesc, setPostDesc] = useState("")
  const [base64IMG, setBase64IMG] = useState("")


  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8080/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(s => s.json()).then(result => {
      setUser(result.data[0])
    })


    fetch(`http://localhost:8080/new-friends`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(s => s.json()).then(result => {
      setNewFriends(result.data)
    })
  }, [])

  const followUser = (username) => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8080/follow-user/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(s => s.json()).then(result => {
      if (result.success) {
        setNewFriends(newFriends.filter(friend => {
          if (friend.username == username)
            return false
          return true
        }))
      }
    })
  }

  const logOut = () => {
    localStorage.removeItem("token")
    navigate('/login')
  }
  const convertToBase64 = (e) => {
    const reader = new FileReader()

    reader.readAsDataURL(e.target.files[0])

    reader.onload = () => {
      console.log('called: ', reader)
      setBase64IMG(reader.result)
    }
  }
  const sharePost = () => {
    const token = localStorage.getItem("token")
    fetch('http://localhost:8080/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Gönderilen verinin türü
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: postDesc,
        image: base64IMG
      }) // Gönderilen veriler JSON formatına dönüştürülüyor
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ağ hatası oluştu: ' + response.statusText);
        }
        return response.json(); // Yanıtı JSON formatında döndür
      })
      .then(data => {

        navigate("/")
      })
  }

  return (
    <div className="flex w-full h-full">
      <div className='flex-none relative w-60'>
        <div className='p-3 border-r-2 fixed w-60 h-screen'>
          <div className='flex items-center gap-2 text-xl'>
            <img className='w-10' src="https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/62-instagram-512.png" alt="" />
            instagram
          </div>
          <div className='h-32'></div>
          <div >
            <Link className='p-3 flex items-center gap-2' to="/">
              <IoIosHome size={25} /> Anasayfa
            </Link>
          </div>
          <div className='p-3 flex items-center gap-2'>

            <Dialog>
              <DialogTrigger className=' flex items-center gap-2'>
                <FaPlus size={25} /> Paylaş
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Post</DialogTitle>
                  <DialogDescription>
                    <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                      <img src={base64IMG} alt="" className='w-32 h-32' />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                      <Label htmlFor="picture">Picture</Label>
                      <Input id="picture" type="file" onChange={convertToBase64} />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
                      <Label htmlFor="desc">Description</Label>
                      <Input id="desc" type="text" onInput={(event) => setPostDesc(event.target.value)} value={postDesc} />
                    </div>
                    <DialogClose asChild>
                      <Button onClick={() => sharePost()}>Share</Button>
                    </DialogClose>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className='p-3 flex items-center gap-2'>
            <IoIosSearch size={25} /> Ara
          </div>
          <div className='p-3 flex items-center gap-2'>
            <MdExplore size={25} /> Keşfet
          </div>
          <div className='p-3 flex items-center gap-2'>
            <TiMessage size={25} /> Mesajlar
          </div>
          <div className='p-3 flex items-center gap-2'>
            <IoNotificationsCircleOutline size={25} /> Bildirimler
          </div>
          <div >
            <Link className='p-3 flex items-center gap-2' to={`/profile/${user.username}`}>
              <Avatar>
                <AvatarImage src={user.profile_photo} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> Profil</Link>
          </div>
        </div>
      </div>
      <div className='flex-1 bg-slate-100 px-32 py-16'>
        {children}
      </div>


      <div className='flex-none relative w-60'>
        <div className='p-3 border-l-2 fixed w-60 h-screen'>
          <div className="flex items-center justify-between gap-2">
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src={user.profile_photo} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {user.username}
            </div>
            <Button onClick={() => logOut()}>Log Out</Button>
          </div>

          <div className='w-full h-20'></div>
          <p>Arkadaş Ekle</p>

          {newFriends.map(newFriend => (
            <div className="flex items-center justify-between gap-2 py-2" key={newFriend.id}>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src={newFriend.profile_photo} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Link to={`/profile/${newFriend.username}`}>{newFriend.username}</Link>
              </div>
              <Button onClick={() => followUser(newFriend.username)}>Takip Et</Button>

            </div>
          ))}


        </div>
      </div>
    </div>
  )
}
