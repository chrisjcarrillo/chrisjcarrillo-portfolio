import React, { Component } from 'react';
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Home.module.scss';
import { browserName, deviceType, osName, osVersion } from 'react-device-detect';
import moment, { now } from 'moment';


// export async function getStaticProps() {
//     try {
//         const result = await fetch('http://localhost:3000/api/default');
//         const settings = await result.json();
//         return {
//             props: {
//                 settings,
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }


export default function Home(){
    
    // let me = settings;

    let currentTime = moment().format("dddd, MMMM Do YYYY, h:mm A");

    let currentBrowser = { 
        name: browserName,
        type: deviceType,
        osName: osName,
        osVersion: osVersion
    }

    console.log(browserName);

    return (
        <div className={styles.container}>
            {/* <header className={styles.header}>TEXT</header>     */}
            <div className={styles.inner_main_right}>
                <div className={styles.inner}>
                    <h1 className={styles.hello_world}>Hello World!</h1>
                    {/* <h1 className={styles.greeting}>I'm {me.alias}.</h1> */}
                    <div className={styles.label_container}>
                        <h1 className={styles.label}>A Miami Based <br /> Creative & Software Engineer </h1>
                    </div>
                    <div className={styles.icon_container}>
                        {/* <a href={me.linkedIn} passHref={true} target="_blank">
                            <FontAwesomeIcon icon={["fab", "linkedin-in"]} size="2x"/>
                        </a>
                        <a href={me.instagram} passHref={true} target="_blank">
                            <FontAwesomeIcon icon={["fab", "instagram"]} size="2x"/>
                        </a>
                        <a href={me.github} passHref={true} target="_blank">
                            <FontAwesomeIcon icon={["fab", "github"]} size="2x"/>
                        </a> */}
                    </div>
                </div>
                <div className={styles.inner}>
                    <div className={styles.cli}>
                        <div className={styles.cli_header}>
                            <div className={styles.dot_container}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            <div className={styles.ip_container}>
                                <span>
                                    {/* Current IP: {me.ipAddress} */}
                                </span>
                            </div>
                        </div>
                        <div className={styles.cli_inner}>
                                <span className={styles.extra_info}>
                                    last login: {currentTime}
                                </span>
                                <span className={styles.extra_info}>
                                    {/* current location: {me.city + ',' + me.state + ',' + me.country } */}
                                </span>
                                <span className={styles.extra_info}>
                                    device information: {
                                        currentBrowser.osName + ', v' + currentBrowser.osVersion + ', ' + currentBrowser.name
                                    }
                                </span>
                                <h2 className={styles.nav_link}>
                                <span className={styles.nav_dollar}>$ </span><a>about me</a>
                                </h2>
                                <h2 className={styles.nav_link}>
                                    <span className={styles.nav_dollar}>$ </span><a>work</a>
                                </h2>
                                <h2 className={styles.nav_link}>
                                    <span className={styles.nav_dollar}>$ </span><a>projects</a>
                                </h2>
                                <h2 className={styles.nav_link}>
                                    <span className={styles.nav_dollar}>$ </span><a>contact</a>
                                </h2>
                        </div>
                    </div>
                </div>
            </div>            
            {/* <footer>TEXT</footer> */}
        </div>
    ) 
}
