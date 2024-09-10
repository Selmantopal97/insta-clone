import { useState, useEffect } from 'react'
import Layout from './Layout'
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();

    const HandleLogin = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Gönderilen verinin türü
            },
            body: JSON.stringify({
                username: username,
                password: password
            }) // Gönderilen veriler JSON formatına dönüştürülüyor
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ hatası oluştu: ' + response.statusText);
                }
                return response.json(); // Yanıtı JSON formatında döndür
            })
            .then(data => {
                if (data.login === true) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('loggedUsername', username);
                    navigate("/")
                }

                else {
                    alert("bilgileriniz yanlış")
                }
            })
            .catch(error => {
                console.error('Hata:', error);
            });
    }

    const [username, setUsername] = useState("")

    const [password, setPassword] = useState("")


    return (
        <>
            <div className='flex h-screen w-full items-center justify-center'>
                <Card className='w-60 h-72'>
                    <CardHeader>
                        <CardTitle className="flex justify-center">Instagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={HandleLogin} className="flex flex-col gap-2">
                            <Input onInput={(event) => setUsername(event.target.value)} value={username} type="username" placeholder="User Name" />
                            <Input onInput={(event) => setPassword(event.target.value)} value={password} type="password" placeholder="Password" />
                            <Button className="w-full" type="submit">Login</Button>
                        </form>
                        Don't Have Account? <Link className="w-full" to="/register">
                            <Button className="w-full">Register</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

        </>
    )
}