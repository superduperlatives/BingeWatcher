import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase.js';
import Slider from 'react-slick';
import swal from 'sweetalert';

class Footer extends Component {
    render(){
        return(
            <div className="footer">
                <div>
                    <h2>Group 6 - SuperDuperLatives</h2>
                    <ul>
                        <li>Jeff Yeong</li>
                        <li>Andrea Maille</li>
                        <li>Tommy Lay</li>
                        <li>Brian Kan</li>
                    </ul>
                </div>
                <div>
                    <h2>API</h2>
                    <p>TVMAZE</p>
                    <p>http://www.tvmaze.com/api</p>
                </div>
            </div>
        )
    }
}

export default Footer;