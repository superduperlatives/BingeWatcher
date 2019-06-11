import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase.js';
import Slider from 'react-slick';
import swal from 'sweetalert';

class Footer extends Component {
    render(){
        return(
            <footer className="footer">            
                <div className="wrapper footerStyling">
                    <div class="subFooterStyling subFooterH2">
                        <div className="footerTextInlineBlock"><h2 class="footerH2">Group 6 - SuperDuperLatives :</h2></div>
                         <div className="footerTextInlineBlock"><h2 class="footerH2">API :</h2></div>
                    </div>
                    <div class="subFooterStyling subFooterLinks">                        
                         <div className="footerTextInlineBlock"><a href="https://github.com/superduperlatives/BingeWatcher.git">Jeff Yeung, Andrea Maille, Tommy Lay, Brian Kan</a></div>
                        <div className="footerTextInlineBlock"><a href="http://www.tvmaze.com/api">TVMAZE</a></div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;