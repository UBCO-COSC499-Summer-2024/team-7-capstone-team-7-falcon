"use client"
import axios from "axios";
import { useState } from "react";
import styles from './signup.module.css'; // Import CSS module
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('', {

                email,
                password,
            });
            router.push('/');
        } catch (error) {
            setError(true)
            console.log(error.response.data)
            
            }
        }
    
    

    return (
        <div className={styles.signupContainer}>
            <div className={styles.wrapper}>
            <h2 className={styles.heading}>Login</h2>
            <hr className={styles.hrLine} />
            <p className={error === "" ? styles.hide : styles.show}>{error}</p>
                <form onSubmit={handleSubmit}>
                   
                      <div>
                        <label htmlFor="email" className={styles.Label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.Input}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={styles.Label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.Input}
                        />
                    </div>
                    <button type="submit" className={styles.btn}>Login</button>
                    
                </form>
            </div>
        </div>
    )
}