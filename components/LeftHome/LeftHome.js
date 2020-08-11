import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../styles/Home.module.scss';

export default function LeftHome(){
    return(
        <div className={styles.inner}>
            <h1 className={styles.hello_world}>Hello World!</h1>
            <h1 className={styles.greeting}>I'm {me.alias}.</h1>
            <div className={styles.label_container}>
                <h1 className={styles.label}>A Miami Based <br /> Creative & Software Engineer </h1>
            </div>
            <div className={styles.icon_container}>
                <a href={me.linkedIn} passHref={true} target="_blank">
                    <FontAwesomeIcon icon={["fab", "linkedin-in"]} size="2x"/>
                </a>
                <a href={me.instagram} passHref={true} target="_blank">
                    <FontAwesomeIcon icon={["fab", "instagram"]} size="2x"/>
                </a>
                <a href={me.github} passHref={true} target="_blank">
                    <FontAwesomeIcon icon={["fab", "github"]} size="2x"/>
                </a>
            </div>
        </div>
    )
}