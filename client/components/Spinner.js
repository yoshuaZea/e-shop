import React from 'react'
import styles from '../styles/spinner.module.css'

const Spinner = ({ text }) => {
    return ( 
        <>
            <div className="min-h-screen flex flex-col justify-center">
                <div className={styles.skChase}>
                    <div className={styles.skChaseDot}></div>
                    <div className={styles.skChaseDot}></div>
                    <div className={styles.skChaseDot}></div>
                    <div className={styles.skChaseDot}></div>
                    <div className={styles.skChaseDot}></div>
                    <div className={styles.skChaseDot}></div>
                </div>
                {
                    text && <p className="text-center text-indigo-800 text-xs font-bold mt-5">{text}</p>
                }
            </div>
            
        </>
    )
}
 
export default Spinner;